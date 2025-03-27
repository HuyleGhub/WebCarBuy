"use client";
import React, { useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";

interface DanhGiaTraiNghiem {
  idDanhGia: number;
  idLichHen: number;
  idUser: number;
  idXe: number;
  SoSao: number;
  NoiDung: string;
  NgayDanhGia: string;
  user?: {
    Hoten: string;
    Avatar: string;
  };
}

interface CarReviewsProps {
  idXe: number;
}

// Using a more specific type with index signature
type RatingStats = {
  [key: number]: number;
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
};

const CarReviews = ({ idXe }: CarReviewsProps) => {
  const [reviews, setReviews] = useState<DanhGiaTraiNghiem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [reviewStats, setReviewStats] = useState<RatingStats>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });

  useEffect(() => {
    fetchReviews();
  }, [idXe]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/danhgia/${idXe}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setReviews(data);

      // Calculate average rating and stats
      if (data.length > 0) {
        const totalStars = data.reduce(
          (sum: number, review: DanhGiaTraiNghiem) => sum + review.SoSao,
          0
        );
        const avg = totalStars / data.length;
        setAverageRating(parseFloat(avg.toFixed(1)));

        // Count reviews by star rating
        const stats: RatingStats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        data.forEach((review: DanhGiaTraiNghiem) => {
          const rating = review.SoSao;
          // Make sure we only count valid ratings from 1-5
          if (rating >= 1 && rating <= 5) {
            stats[rating as 1 | 2 | 3 | 4 | 5]++;
          }
        });
        setReviewStats(stats);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError("Không thể tải đánh giá");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <span className="loading loading-spinner text-blue-600 loading-md"></span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 py-4">{error}</div>;
  }

  return (
    <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Đánh giá từ người dùng</h2>

      {reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Chưa có đánh giá nào cho xe này
        </div>
      ) : (
        <>
          {/* Summary section */}
          <div className="flex flex-col md:flex-row gap-8 mb-8 pb-6 border-b">
            <div className="flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-blue-600">
                {averageRating}
              </div>
              <div className="mt-2">
                <ReactStars
                  count={5}
                  value={averageRating}
                  size={24}
                  activeColor="#ffd700"
                  edit={false}
                  isHalf={true}
                />
              </div>
              <div className="text-gray-500 mt-1">
                {reviews.length} đánh giá
              </div>
            </div>

            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((stars) => {
                // Use type assertion to handle the typescript index
                const starCount = stars as 1 | 2 | 3 | 4 | 5;

                return (
                  <div key={stars} className="flex items-center mb-2">
                    <div className="w-12 text-sm text-gray-600">
                      {stars} sao
                    </div>
                    <div className="flex-1 mx-3">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400"
                          style={{
                            width: `${
                              reviews.length
                                ? (reviewStats[starCount] / reviews.length) *
                                  100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-10 text-sm text-gray-600">
                      {reviewStats[starCount]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reviews list */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.idDanhGia}
                className="pb-5 border-b last:border-0"
              >
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-3">
                  {review.user?.Avatar && review.user.Avatar.length > 0 ? (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <img 
                      src={review.user?.Avatar} 
                      alt="Profile Avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white text-sm">
                      {review.user?.Hoten ? review.user?.Hoten.charAt(0).toUpperCase() : '?'}
                    </span>
                  </div>
                )}
                  </div>
                  <div>
                    <div className="font-medium">
                      {review.user?.Hoten || "Người dùng ẩn danh"}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {formatDate(review.NgayDanhGia)}
                    </div>
                  </div>
                </div>

                <div className="ml-13 pl-13">
                  <div className="mb-2">
                    <ReactStars
                      count={5}
                      value={review.SoSao}
                      size={18}
                      activeColor="#ffd700"
                      edit={false}
                    />
                  </div>
                  <p className="text-gray-700">{review.NoiDung}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CarReviews;
