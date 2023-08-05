const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  updateProfile,
  updatePassword,
  getUserDetail,
  getAllUser,
  singleUser,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth");
const singleUpload = require("../middleware/multer");

const userRouter = require("express").Router();

userRouter.route("/register").post(singleUpload.single("file"),registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/password/forget").post(forgotPassword);
userRouter.route("/password/reset/:token").put(resetPassword);
userRouter.route("/password/update").put(isAuthenticatedUser, updatePassword);
userRouter.route("/logout").get(logout);
userRouter.route("/me").get(isAuthenticatedUser, getUserDetail);
userRouter
  .route("/me/update")
  .put(isAuthenticatedUser, singleUpload.single("file"), updateProfile);

// <--admin route--> //

userRouter
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRole("admin"), getAllUser);
userRouter
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRole("admin"), singleUser)
  .put(isAuthenticatedUser, authorizeRole("admin"), updateUserRole)
  .delete(isAuthenticatedUser, authorizeRole("admin"), deleteUser);

module.exports = userRouter;
