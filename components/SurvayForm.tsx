"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, MapPin, Thermometer, Droplets, Calendar, Target, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const formSchema = z.object({
    // Location Data
    district: z.string().min(1, { message: 'District is required.' }),
    block: z.string().min(1, { message: 'Block is required.' }),
    village: z.string().min(1, { message: 'Village name is required.' }),
    farmSize: z.coerce.number().min(0.1, { message: 'Farm size must be at least 0.1 acres.' }),
    
    // Soil Test Results
    soilType: z.string().min(1, { message: 'Soil type is required.' }),
    soilPh: z.coerce.number().min(4).max(10, { message: 'pH must be between 4 and 10.' }),
    nitrogen: z.coerce.number().min(0, { message: 'Nitrogen level is required.' }),
    phosphorus: z.coerce.number().min(0, { message: 'Phosphorus level is required.' }),
    potassium: z.coerce.number().min(0, { message: 'Potassium level is required.' }),
    organicMatter: z.coerce.number().min(0).max(10, { message: 'Organic matter should be between 0-10%.' }),
    
    // Farming Preferences
    season: z.string().min(1, { message: 'Season is required.' }),
    cropType: z.string().min(1, { message: 'Preferred crop type is required.' }),
    farmingExperience: z.string().min(1, { message: 'Farming experience is required.' }),
    budgetRange: z.string().min(1, { message: 'Budget range is required.' }),
    irrigationSource: z.string().min(1, { message: 'Irrigation source is required.' }),
    
    // Additional Information
    previousCrop: z.string().optional(),
    specificRequirements: z.string().optional(),
    contactNumber: z.string().min(10, { message: 'Valid contact number is required.' }),
    preferredLanguage: z.string().min(1, { message: 'Preferred language is required.' }),
})

const districts = [
    "Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Phusro", 
    "Hazaribagh", "Giridih", "Ramgarh", "Medininagar", "Chirkunda", 
    "Pakaur", "Chaibasa", "Dumka", "Sahibganj", "Godda", "Koderma", 
    "Jamtara", "Khunti", "Gumla", "Lohardaga", "Simdega", "Latehar", 
    "Saraikela"
]

const soilTypes = [
    "Red Soil", "Black Soil", "Alluvial Soil", "Laterite Soil", "Sandy Soil", "Clay Soil", "Loamy Soil"
]

const seasons = [
    "Kharif (Monsoon)", "Rabi (Winter)", "Zaid (Summer)"
]

const cropTypes = [
    "Cereals (Rice, Wheat, Maize)", "Pulses (Arhar, Moong, Urad)", 
    "Oilseeds (Mustard, Groundnut)", "Vegetables", "Cash Crops", "Mixed Farming"
]

const experienceLevels = [
    "Beginner (0-2 years)", "Intermediate (3-10 years)", "Experienced (10+ years)"
]

const budgetRanges = [
    "Low (₹5,000 - ₹25,000)", "Medium (₹25,000 - ₹75,000)", "High (₹75,000+)"
]

const irrigationSources = [
    "Rainwater", "Tube well", "Canal", "Pond/Tank", "River", "Mixed Sources"
]

const languages = [
    "Hindi", "English", "Santhali", "Ho", "Mundari", "Kurukh"
]

const AgricultureRecommendationForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            district: '',
            block: '',
            village: '',
            farmSize: 1,
            soilType: '',
            soilPh: 6.5,
            nitrogen: 0,
            phosphorus: 0,
            potassium: 0,
            organicMatter: 2,
            season: '',
            cropType: '',
            farmingExperience: '',
            budgetRange: '',
            irrigationSource: '',
            previousCrop: '',
            specificRequirements: '',
            contactNumber: '',
            preferredLanguage: 'Hindi',
        },
    })
    const router =useRouter()

const onSubmit = async (values: z.infer<typeof formSchema>) => {
  try {
    const res = await fetch("/api/form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) throw new Error("Failed to submit");

    const result = await res.json();
    console.log("✅ Saved:", result);

    toast.success("Form submitted successfully! AI recommendation will be generated.");

    router.push(`/Chat/${result.submission._id}`);
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong. Please try again.");
  }
};


    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                            <Leaf className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Smart-Harvest AI
                        </h1>
                    </div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Get personalized crop recommendations based on your soil test results, location, and farming preferences
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        
                        {/* Location Information */}
                        <Card className="border-green-200 shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
                                <CardTitle className="flex items-center space-x-2">
                                    <MapPin className="h-5 w-5" />
                                    <span>Step 1: Location & Farm Details</span>
                                </CardTitle>
                                <CardDescription className="text-green-100">
                                    Tell us about your farm location and size
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="district"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>District</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger className="border-green-200 focus:border-green-500">
                                                            <SelectValue placeholder="Select your district" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {districts.map((district) => (
                                                                <SelectItem key={district} value={district}>
                                                                    {district}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="block"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Block/Tehsil</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter block name"
                                                        {...field}
                                                        className="border-green-200 focus:border-green-500"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="village"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Village</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter village name"
                                                        {...field}
                                                        className="border-green-200 focus:border-green-500"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="farmSize"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Farm Size (in acres)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.1"
                                                        placeholder="1.0"
                                                        {...field}
                                                        className="border-green-200 focus:border-green-500"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Soil Test Results */}
                        <Card className="border-green-200 shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                                <CardTitle className="flex items-center space-x-2">
                                    <Thermometer className="h-5 w-5" />
                                    <span>Step 2: Soil Test Results</span>
                                </CardTitle>
                                <CardDescription className="text-green-100">
                                    Upload your soil test report or enter values manually
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="soilType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Soil Type</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger className="border-green-200 focus:border-green-500">
                                                            <SelectValue placeholder="Select soil type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {soilTypes.map((type) => (
                                                                <SelectItem key={type} value={type}>
                                                                    {type}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="soilPh"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Soil pH</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.1"
                                                        placeholder="6.5"
                                                        {...field}
                                                        className="border-green-200 focus:border-green-500"
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Normal range: 6.0 - 7.5
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="nitrogen"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nitrogen (N) in kg/ha</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="240"
                                                        {...field}
                                                        className="border-green-200 focus:border-green-500"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="phosphorus"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phosphorus (P) in kg/ha</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="45"
                                                        {...field}
                                                        className="border-green-200 focus:border-green-500"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="potassium"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Potassium (K) in kg/ha</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="180"
                                                        {...field}
                                                        className="border-green-200 focus:border-green-500"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="organicMatter"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Organic Matter (%)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.1"
                                                        placeholder="2.5"
                                                        {...field}
                                                        className="border-green-200 focus:border-green-500"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Farming Preferences */}
                        <Card className="border-green-200 shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                                <CardTitle className="flex items-center space-x-2">
                                    <Target className="h-5 w-5" />
                                    <span>Step 3: Farming Preferences</span>
                                </CardTitle>
                                <CardDescription className="text-green-100">
                                    Tell us about your farming goals and resources
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="season"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Growing Season</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger className="border-green-200 focus:border-green-500">
                                                            <SelectValue placeholder="Select season" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {seasons.map((season) => (
                                                                <SelectItem key={season} value={season}>
                                                                    {season}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="cropType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Preferred Crop Type</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger className="border-green-200 focus:border-green-500">
                                                            <SelectValue placeholder="Select crop type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {cropTypes.map((type) => (
                                                                <SelectItem key={type} value={type}>
                                                                    {type}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="farmingExperience"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Farming Experience</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger className="border-green-200 focus:border-green-500">
                                                            <SelectValue placeholder="Select experience level" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {experienceLevels.map((level) => (
                                                                <SelectItem key={level} value={level}>
                                                                    {level}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="budgetRange"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Investment Budget</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger className="border-green-200 focus:border-green-500">
                                                            <SelectValue placeholder="Select budget range" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {budgetRanges.map((range) => (
                                                                <SelectItem key={range} value={range}>
                                                                    {range}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="irrigationSource"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Water/Irrigation Source</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger className="border-green-200 focus:border-green-500">
                                                            <SelectValue placeholder="Select water source" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {irrigationSources.map((source) => (
                                                                <SelectItem key={source} value={source}>
                                                                    {source}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="preferredLanguage"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Preferred Language</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger className="border-green-200 focus:border-green-500">
                                                            <SelectValue placeholder="Select language" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {languages.map((lang) => (
                                                                <SelectItem key={lang} value={lang}>
                                                                    {lang}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Additional Information */}
                        <Card className="border-green-200 shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                                <CardTitle className="flex items-center space-x-2">
                                    <Droplets className="h-5 w-5" />
                                    <span>Step 4: Additional Information (Optional)</span>
                                </CardTitle>
                                <CardDescription className="text-green-100">
                                    Help us provide better recommendations
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="previousCrop"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Previous Crop Grown</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g., Rice, Wheat, Maize"
                                                        {...field}
                                                        className="border-green-200 focus:border-green-500"
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Helps determine crop rotation benefits
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="contactNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Contact Number</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="10-digit mobile number"
                                                        {...field}
                                                        className="border-green-200 focus:border-green-500"
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    For follow-up support and updates
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="specificRequirements"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Specific Requirements or Concerns</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Any specific goals, concerns, or questions you have about crop selection?"
                                                    {...field}
                                                    className="border-green-200 focus:border-green-500 min-h-[100px]"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Help us understand your unique farming situation
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Submit Button */}
                        <Card className="border-green-200 shadow-lg">
                            <CardContent className="p-6">
                                <Button 
                                    type="submit" 
                                    className="w-full py-4 text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                >
                                    <Leaf className="h-5 w-5 mr-2" />
                                    Get AI Crop Recommendations
                                </Button>
                                <p className="text-center text-gray-600 mt-4">
                                    Our AI will analyze your data with weather conditions to provide personalized crop recommendations
                                </p>
                            </CardContent>
                        </Card>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default AgricultureRecommendationForm