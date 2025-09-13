"use client";

import { useState } from "react";
import { Users, PlusCircle, Radio, LeafyGreen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GroupsComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample premier groups
  const premierGroups = [
    {
      id: 1,
      name: "Agri News",
      description: "Get the latest government agricultural updates and schemes.",
      icon: <Radio className="w-6 h-6 text-green-500" />,
    },
    {
      id: 2,
      name: "Weather Updates",
      description: "Daily forecasts and alerts for farmers nationwide.",
      icon: <LeafyGreen className="w-6 h-6 text-green-500" />,
    },
    {
      id: 3,
      name: "Soil & Fertilizer Board",
      description: "Government advisories on soil health and fertilizers.",
      icon: <Users className="w-6 h-6 text-green-500" />,
    },
  ];

  return (
    <div className="min-h-screen bg-green-50 text-gray-800 p-6">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-green-500">
            Farming Communities
          </h1>
          <p className="text-gray-600">
            Join premier government groups for official updates or create your
            own community to connect with farmers.
          </p>
        </div>

        {/* Premier Groups */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Premier Government Groups
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {premierGroups.map((group) => (
              <motion.div
                key={group.id}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-2xl shadow-md border border-gray-200 p-5 flex flex-col justify-between"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-green-100 rounded-xl">
                    {group.icon}
                  </div>
                  <h3 className="text-lg font-bold text-green-500">
                    {group.name}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 flex-grow">
                  {group.description}
                </p>
                <button className="mt-4 px-4 py-2 rounded-lg bg-green-600 text-white font-medium shadow hover:bg-green-700 transition">
                  Join Group
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Community Groups */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Community Groups
            </h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center px-4 py-2 rounded-lg bg-green-600 text-white font-medium shadow hover:bg-green-600 transition"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Create Group
            </button>
          </div>
          <div className="text-gray-500 text-sm italic">
            No groups created yet. Start by making one!
          </div>
        </section>
      </div>

      {/* Modal for Creating Group */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Create a New Group
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Group Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter group name"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter group description"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium shadow hover:bg-green-500 transition"
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
