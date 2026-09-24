"use client"

export {
  useActivityCreator,
  useLogActivity,
  useActivities,
  createActivity,
  logActivity,
  clearActivities,
  calculateActivityStats,
  exportActivitiesAsJson,
  exportActivitiesAsCsv,
} from "@/lib/activity/activity-service"

export type {
  Activity,
  ActivityCategory,
  ActivityStatus,
  ActivityType,
  ActivityStats,
  ActivityFilterState,
  CreateActivityInput,
} from "@/lib/activity/types"



//  createActivity({
//       title: "Order Placed",
//       description: "User checked out cart with 3 items.",
//       category: "Account", // "Security" | "Files" | "Account" | "Settings" | "System" | "Admin" (default: "System")
//       status: "success",   // "success" | "warning" | "error" | "info" (default: "info")
//       type: "login",       // or any ActivityType (default: "system_event")
//     })
//   }
