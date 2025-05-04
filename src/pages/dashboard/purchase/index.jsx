import React, { useState, useEffect } from "react";
import LayoutAdmin from "../../../layouts/Dashboard";
import { Api } from "../../../api/index";
import CardFavorite from "../../../components/utilities/my-favorite/CardFavorite";
import { SkeletonMyFavorite } from "../../../components/utilities/skeleton";
import Cookies from "js-cookie";

function Favorite() {
  useEffect(() => {
    document.title = "Traveling | My Favorite";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const token = Cookies.get("token");
  const [myFavorite, setMyFavorite] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDataMyFavorite = async () => {
    try {
      const response = await Api.get("/favorite", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyFavorite(response.data.data || []);
    } catch (error) {
      console.error("Error fetching favorite data:", error);
      setMyFavorite([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Apakah kamu yakin ingin menghapus dari favorit?");
    if (!confirm) return;

    try {
      await Api.delete(`/favorite/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Filter item yang dihapus
      setMyFavorite((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Gagal menghapus favorite:", error);
      alert("Terjadi kesalahan saat menghapus data.");
    }
  };

  useEffect(() => {
    fetchDataMyFavorite();
  }, []);

  return (
    <LayoutAdmin>
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {loading ? (
          <SkeletonMyFavorite />
        ) : myFavorite.length > 0 ? (
          myFavorite.map((favorite) => {
            const { tour } = favorite.item || {};
            return tour ? (
              <div key={favorite.id} className="relative">
                <CardFavorite
                  id={tour.id}
                  slug={tour.slug}
                  title={tour.title}
                  featured_image={tour.featured_image}
                  featured={tour.featured}
                  premium={tour.premium}
                  city={tour.city?.name || "Unknown City"}
                  type={favorite.type_tour}
                  rating={tour.rating}
                  review_count={tour.review_count}
                />
                <button
                  onClick={() => handleDelete(favorite.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
                >
                  Hapus
                </button>
              </div>
            ) : null;
          })
        ) : (
          <div className="col-span-2 lg:col-span-4 text-center text-gray-500">
            <p>Belum ada wisata favorit.</p>
          </div>
        )}
      </section>
    </LayoutAdmin>
  );
}

export default Favorite;
