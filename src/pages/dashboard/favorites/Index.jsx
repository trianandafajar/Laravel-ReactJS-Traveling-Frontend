import React, { useState, useEffect } from "react";
import LayoutAdmin from "../../../layouts/Dashboard";
import { Api } from "../../../api/index";
import CardFavorite from "../../../components/utilities/my-favorite/CardFavorite";
import { SkeletonMyFavorite } from "../../../components/utilities/skeleton";
import Cookies from "js-cookie";

function Favorite() {
  // Set title halaman
  useEffect(() => {
    document.title = "Traveling | My Favorite";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // State untuk menyimpan data favorit & status loading
  const token = Cookies.get("token");
  const [myFavorite, setMyFavorite] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function untuk mengambil data favorit dari API
  const fetchDataMyFavorite = async () => {
    try {
      const response = await Api.get("/favorite", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyFavorite(response.data.data || []);
    } catch (error) {
      console.error("Error fetching favorite data:", error);
      setMyFavorite([]); // Menghindari nilai null atau undefined
    } finally {
      setLoading(false);
    }
  };

  // Fetch data saat komponen pertama kali di-mount
  useEffect(() => {
    fetchDataMyFavorite();
  }, []);

  return (
    <LayoutAdmin>
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {/* Skeleton saat loading */}
        {loading ? (
          <SkeletonMyFavorite />
        ) : myFavorite.length > 0 ? (
          myFavorite.map((favorite) => {
            const { tour } = favorite.item || {}; // Menghindari error jika `item` undefined
            return tour ? (
              <CardFavorite
                key={tour.id}
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
