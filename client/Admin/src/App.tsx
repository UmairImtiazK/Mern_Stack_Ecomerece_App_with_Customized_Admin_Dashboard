import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  Categories,
  CreateCategory,
  CreateOrder,
  CreateProduct,
  UpdateProduct,
  CreateReview,
  CreateUser,
  EditCategory,
  EditOrder,
  EditReview,
  EditUser,
  HelpDesk,
  HomeLayout,
  Landing,
  LandingV2,
  Login,
  Notifications,
  Orders,
  Products,
  Profile,
  Register,
  Reviews,
  Users,
} from "./pages";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Creating router with proper paths
const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <Navigate to="/login" replace />, // Redirect to login by default
  },
  {
    path: "/dashboard", // Base dashboard route
    element: (
      <ProtectedRoute>
        <HomeLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true, // This is the default route for /dashboard
        element: <Landing />,
      },
      {
        path: "landing-v2", // Accessible via /dashboard/landing-v2
        element: <LandingV2 />,
      },
      {
        path: "products", // /dashboard/products
        element: <Products />,
      },
      {
        path: "products/create-product", // /dashboard/products/create-product
        element: <CreateProduct />,
      },
      {
        path: "update-product/:id", // /dashboard/update-product/:id
        element: <UpdateProduct />,
      },
      {
        path: "categories", // /dashboard/categories
        element: <Categories />,
      },
      {
        path: "categories/create-category", // /dashboard/categories/create-category
        element: <CreateCategory />,
      },
      {
        path: "categories/:id", // /dashboard/categories/:id
        element: <EditCategory />,
      },
      {
        path: "orders", // /dashboard/orders
        element: <Orders />,
      },
      {
        path: "orders/create-order", // /dashboard/orders/create-order
        element: <CreateOrder />,
      },
      {
        path: "orders/1", // /dashboard/orders/1
        element: <EditOrder />,
      },
      {
        path: "reviews", // /dashboard/reviews
        element: <Reviews />,
      },
      {
        path: "reviews/:id", // /dashboard/reviews/:id
        element: <EditReview />,
      },
      {
        path: "reviews/create-review", // /dashboard/reviews/create-review
        element: <CreateReview />,
      },
      {
        path: "users", // /dashboard/users
        element: <Users />,
      },
      {
        path: "users/:id", // /dashboard/users/:id
        element: <EditUser />,
      },
      {
        path: "users/create-user", // /dashboard/users/create-user
        element: <CreateUser />,
      },
      {
        path: "help-desk", // /dashboard/help-desk
        element: <HelpDesk />,
      },
      {
        path: "notifications", // /dashboard/notifications
        element: <Notifications />,
      },
      {
        path: "profile", // /dashboard/profile
        element: <Profile />,
      },
      // Catch-all route within /dashboard for undefined paths
      {
        path: "*",
        element: <Navigate to="/dashboard/landing-v2" />, // Default redirect within /dashboard
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
