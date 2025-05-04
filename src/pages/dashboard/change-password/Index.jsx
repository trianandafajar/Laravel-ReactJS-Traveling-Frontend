import React, { useEffect, useState } from "react";
import LayoutAdmin from "../../../layouts/Dashboard";
import { Api } from "../../../api";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

function ChangePassword() {
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setLoading] = useState(false);
	const [validation, setValidation] = useState({});
	const token = Cookies.get("token");

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setValidation({});

		try {
			await Api.post(
				"/update-password",
				{
					current_password: currentPassword,
					new_password: newPassword,
					confirm_password: confirmPassword,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			toast.success("Password updated successfully!");
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
		} catch (error) {
			if (error.response?.data) {
				setValidation(error.response.data);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<LayoutAdmin>
			<div className="px-8 py-6 mx-4 mt-4 text-left bg-white border-2 border-gray-100 md:w-1/3 lg:w-1/3 sm:w-1/3 rounded-xl">
				<h3 className="text-2xl font-bold">Change Password</h3>
				<hr className="my-3" />
				<form onSubmit={handleSubmit}>
					<div className="mt-4">
						<label className="block font-bold" htmlFor="currentPassword">
							Current Password
						</label>
						<input
							id="currentPassword"
							type="password"
							value={currentPassword}
							onChange={(e) => setCurrentPassword(e.target.value)}
							placeholder="Enter your current password"
							className="w-full px-4 py-2 mt-2 placeholder:text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
						/>
						{validation.current_password && (
							<p className="text-sm text-red-500 mt-1">{validation.current_password[0]}</p>
						)}
					</div>

					<div className="mt-4">
						<label className="block font-bold" htmlFor="newPassword">
							New Password
						</label>
						<input
							id="newPassword"
							type="password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							placeholder="Enter your new password"
							className="w-full px-4 py-2 mt-2 placeholder:text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
						/>
						{validation.new_password && (
							<p className="text-sm text-red-500 mt-1">{validation.new_password[0]}</p>
						)}
					</div>

					<div className="mt-4">
						<label className="block font-bold" htmlFor="confirmPassword">
							Confirm Password
						</label>
						<input
							id="confirmPassword"
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							placeholder="Enter your new password again"
							className="w-full px-4 py-2 mt-2 placeholder:text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
						/>
						{validation.confirm_password && (
							<p className="text-sm text-red-500 mt-1">{validation.confirm_password[0]}</p>
						)}
					</div>

					<div className="flex">
						<button
							type="submit"
							className="ml-auto w-48 px-6 py-2 mt-4 text-white bg-gray-600 rounded-lg hover:bg-[#003580]"
							disabled={isLoading}
						>
							{isLoading ? "Saving..." : "Save Changes"}
						</button>
					</div>
				</form>
			</div>
		</LayoutAdmin>
	);
}

export default ChangePassword;
