import { createBrowserRouter, Navigate } from 'react-router-dom'
import AuthCallbackPage from '../features/auth/pages/AuthCallbackPage'
import BookingProcessingPage from '../features/bookings/pages/BookingProcessingPage'
import BookSessionPage from '../features/bookings/pages/BookSessionPage'
import BrowseMentorsPage from '../features/mentors/pages/BrowseMentorsPage'
import MentorProfilePage from '../features/mentors/pages/MentorProfilePage'
import SystemPage from '../pages/system/SystemPage'
import { RequireActive } from './guards/RequireActive'
import { RequireAuth } from './guards/RequireAuth'
import { RequireRole } from './guards/RequireRole'
import { PublicLayout } from './layouts/PublicLayout'

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { index: true, element: <Navigate to="/mentors" replace /> },
      { path: 'mentors', element: <BrowseMentorsPage /> },
      { path: 'mentors/:mentorId', element: <MentorProfilePage /> },
      { path: 'auth/callback', element: <AuthCallbackPage /> },

      {
        element: <RequireAuth />,
        children: [
          {
            element: <RequireActive />,
            children: [
              {
                element: <RequireRole roles={['STUDENT']} />,
                children: [{ path: 'mentors/:mentorId/book', element: <BookSessionPage /> }],
              },
              { path: 'bookings/:bookingId/processing', element: <BookingProcessingPage /> },
            ],
          },
        ],
      },

      { path: '403', element: <SystemPage kind="forbidden" /> },
      { path: 'suspended', element: <SystemPage kind="suspended" /> },
      { path: 'deactivated', element: <SystemPage kind="deactivated" /> },
      { path: '*', element: <SystemPage kind="notFound" /> },
    ],
  },
])
