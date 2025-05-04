import React, { useState, useEffect } from "react";
import LayoutAdmin from "../../../layouts/Dashboard";
import { Api } from "../../../api";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useHistory } from "react-router-dom";
import InputField from "../../../components/form/InputField";

function Account() {
  document.title = "Traveling | Account";
  const [name, setName] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isLoadingPassword, setLoadingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validation, setValidation] = useState({});
  const [showName, setShowName] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const token = Cookies.get("token");
  const history = useHistory();

  const fetchData = async () => {
    try {
      const { data } = await Api.get("/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setName(data.data.name);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchData();
  }, []);

  const updateAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("_method", "POST");

    try {
      await Api.post(`/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoading(false);
      toast.success("Data Updated!", {
        duration: 4000,
        position: "top-right",
        style: { background: "#333", color: "#fff" },
      });
      Cookies.set("user_name", name);
      fetchData();
      setValidation({});
    } catch (error) {
      setLoading(false);
      setValidation(error.response?.data?.errors || {});
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    setLoadingPassword(true);

    try {
      await Api.post(
        `/update-password`,
        {
          current_password: currentPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Password Updated Successfully!", {
        duration: 4000,
        position: "top-right",
        style: { background: "#333", color: "#fff" },
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setValidation({});
      setShowPass(false);
    } catch (error) {
      setValidation(error.response?.data || {});
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <LayoutAdmin>
      <div className="grid grid-cols-1 gap-y-4">
        <section>
          <h5 className="text-3xl font-semibold">Account Information</h5>
          <p className="text-base font-normal text-gray-500">
            Manage your account information and password settings.
          </p>
        </section>
        <hr />
        <section className="flex justify-between items-start">
          <h5 className="text-base font-medium">Name</h5>
          <p className="text-sm font-normal w-96 text-gray-500">
            Update the name associated with your account.
          </p>
          <button
            onClick={() => setShowName(!showName)}
            className="text-blue-900 text-base font-medium"
          >
            Change name
          </button>
        </section>
        {showName && (
          <section>
            <form
              onSubmit={updateAccount}
              className="flex justify-between items-center"
            >
              <InputField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                error={validation?.name?.[0]}
              />
              <button
                type="submit"
                className="bg-black px-4 py-2 rounded-lg text-sm text-white"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Save Change"}
              </button>
            </form>
          </section>
        )}
        <hr />
        <section className="flex justify-between items-start">
          <h5 className="text-base font-medium">Password</h5>
          <p className="text-sm font-normal w-96 text-gray-500">
            Update your password regularly for security.
          </p>
          <button
            onClick={() => setShowPass(!showPass)}
            className="text-blue-900 text-base font-medium"
          >
            Change password
          </button>
        </section>
        {showPass && (
          <section>
            <form
              onSubmit={updatePassword}
              className="flex justify-between items-center"
            >
              <div className="space-y-4 flex flex-col w-96">
                <InputField
                  label="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  error={
                    validation?.current_password?.[0] || validation?.message
                  }
                />
                <InputField
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  error={validation?.new_password?.[0]}
                />
                <InputField
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type your new password"
                  error={validation?.confirm_password?.[0]}
                />
              </div>
              <button
                type="submit"
                className="bg-black px-4 py-2 rounded-lg text-sm text-white"
                disabled={isLoadingPassword}
              >
                {isLoadingPassword ? "Loading..." : "Save Change"}
              </button>
            </form>
          </section>
        )}
      </div>
    </LayoutAdmin>
  );
}

export default Account;
