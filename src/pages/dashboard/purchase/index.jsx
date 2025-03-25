import React, { useState, useEffect } from "react";
import LayoutAdmin from "../../../layouts/Dashboard";
import { Api } from "../../../api/index";
import {
  SkeletonCurrentPackage,
  SkeletonHistoryPayment,
} from "../../../components/utilities/skeleton";
import PaginationComponent from "../../../components/utilities/Pagination";
import moment from "moment";
import Cookies from "js-cookie";

function Purchase() {
  useEffect(() => {
    document.title = "Traveling | Riwayat Pembayaran";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // State Management
  const token = Cookies.get("token");
  const [currentPackage, setCurrentPackage] = useState(null);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  // Fetch Data Paket Aktif
  const fetchDataCurrentPackage = async () => {
    setLoading(true);
    try {
      const response = await Api.get("/current-package", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentPackage(response.data.data || {});
    } catch (error) {
      console.error("Error fetching current package:", error);
      setCurrentPackage(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Data Riwayat Pembayaran
  const fetchDataPurchaseHistory = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const response = await Api.get(`/history-payment?page=${pageNumber}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data.data;
      setPurchaseHistory(data.data || []);
      setCurrentPage(data.current_page || 1);
      setPerPage(data.per_page || 10);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Error fetching purchase history:", error);
      setPurchaseHistory([]);
    } finally {
      setLoading(false);
    }
  };

  // Format Mata Uang
  const numberFormat = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value);

  // Load Data Saat Komponen Pertama Kali Render
  useEffect(() => {
    fetchDataCurrentPackage();
    fetchDataPurchaseHistory();
  }, []);

  return (
    <LayoutAdmin>
      <div className="flex flex-col gap-y-4">
        {/* Paket Saat Ini */}
        <section>
          <h5 className="text-lg font-semibold">Paket Saat Ini</h5>
          <div className="rounded-lg bg-white border w-auto h-auto p-4">
            {loading ? (
              <SkeletonCurrentPackage />
            ) : currentPackage && currentPackage.status === "ACTIVE" ? (
              <div>
                <h5 className="text-3xl font-semibold mb-4">
                  {currentPackage.name_package}
                </h5>
                <p>Status: {currentPackage.status}</p>
                <p>Payment ID: {currentPackage.payment_id}</p>
                <p>
                  Mulai Langganan:{" "}
                  {moment(currentPackage.start_date).format("DD-MM-Y")}
                </p>
                <p>
                  Kadaluarsa:{" "}
                  {moment(currentPackage.expired_date).format("DD-MM-Y")}
                </p>
              </div>
            ) : (
              <div>
                <p className="mb-4">Anda belum memiliki paket</p>
                <a
                  href="/pricing"
                  className="mt-4 bg-[#827B7E] rounded-lg hover:bg-[#322F30] px-4 py-2 text-white"
                >
                  Pilih Paket
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Riwayat Pembayaran */}
        <section>
          <h5 className="text-2xl font-semibold">Riwayat Pembayaran</h5>
          <p className="text-base font-normal text-gray-500">
            Daftar transaksi pembayaran yang telah Anda lakukan.
          </p>
        </section>

        {/* Tabel Pembayaran */}
        <section className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-800">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3">Dibayar Pada</th>
                <th className="px-6 py-3">Nama Paket</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Mata Uang</th>
                <th className="px-6 py-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5">
                    <SkeletonHistoryPayment />
                  </td>
                </tr>
              ) : purchaseHistory.length > 0 ? (
                purchaseHistory.map((history) => (
                  <tr className="text-center" key={history.id}>
                    <td className="px-6 py-4">
                      {moment(history.paid_at).format("DD-MM-Y")}
                    </td>
                    <td className="px-6 py-4">{history.description}</td>
                    <td
                      className={`px-6 py-4 font-semibold ${
                        history.status === "PAID"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {history.status}
                    </td>
                    <td className="px-6 py-4">{history.currency}</td>
                    <td className="px-6 py-4 text-right">
                      {history.currency === "IDR"
                        ? numberFormat(history.amount)
                        : history.amount}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    Data tidak tersedia
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Pagination */}
        {purchaseHistory.length > 0 && (
          <PaginationComponent
            currentPage={currentPage}
            perPage={perPage}
            total={total}
            onChange={fetchDataPurchaseHistory}
            position="end"
          />
        )}
      </div>
    </LayoutAdmin>
  );
}

export default Purchase;
