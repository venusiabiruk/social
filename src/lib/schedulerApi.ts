// lib/scheduleApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const scheduleApi = createApi({
  reducerPath: "scheduleApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000" }), 
  tagTypes: ["Schedule"],
  endpoints: (builder) => ({
    schedulePost: builder.mutation<
      { status: string; scheduled_at: string; postID: string },
      { asset_id: string; platforms: string[]; run_at: string; post_text: string }
    >({
      query: (body) => ({
        url: "/schedule",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Schedule"],
    }),

    scheduleReminder: builder.mutation<
      { status: string; scheduled_for: string },
      { asset_id: string; platform: string; run_at: string }
    >({
      query: (body) => ({
        url: "/schedule/reminder",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Schedule"],
    }),

    getScheduledPost: builder.query<
      { asset_id: string; platform: string; run_at: string; status: string },
      string // asset_id
    >({
      query: (asset_id) => `/schedule/${asset_id}`,
      providesTags: ["Schedule"],
    }),
  }),
});

export const {
  useSchedulePostMutation,
  useScheduleReminderMutation,
  useGetScheduledPostQuery,
} = scheduleApi;
