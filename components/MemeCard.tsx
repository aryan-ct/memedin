"use client";

import { Employee } from "@/lib/types";
import { ReactNode, useEffect, useState } from "react";
import QRCode from "qrcode";

interface MemeCardProps {
  employee: Employee;
  onClick?: () => void;
  children?: ReactNode;
  isLarge?: boolean;
  showQR?: boolean;
}

export default function MemeCard({
  employee,
  onClick,
  children,
  isLarge = false,
  showQR = false,
}: MemeCardProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const cardSize = isLarge ? "w-[500px]" : "w-full";

  useEffect(() => {
    if (showQR && employee.id) {
      const memeYourselfUrl = `${window.location.origin}/meme-yourself?id=${employee.id}`;
      QRCode.toDataURL(memeYourselfUrl, {
        width: 200,
        margin: 1,
      })
        .then(setQrCodeUrl)
        .catch(console.error);
    }
  }, [showQR, employee.id]);

  return (
    <div
      className={`${cardSize} max-w-full meme-frame transition-transform`}
      onClick={onClick}
    >
      {/* Caption at top - meme style */}
      <div className="bg-white px-4 pt-3 pb-6 text-center">
        <p
          className={`text-black font-bold ${
            isLarge ? "text-2xl" : "text-[0.8rem]"
          } uppercase tracking-wide leading-tight`}
        >
          {employee.caption}
        </p>
      </div>

      {/* Image/Video area - Square aspect ratio */}
      <div className="bg-gray-200 aspect-square flex items-center justify-center overflow-hidden relative">
        {children ? (
          children
        ) : employee.imageUrl ? (
          <img
            src={employee.imageUrl}
            alt={employee.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400 text-center p-6 flex flex-col items-center justify-center h-full">
            {showQR && qrCodeUrl ? (
              <>
                <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48 mb-4" />
                <p className="text-sm font-semibold text-gray-600">
                  Scan to take your photo
                </p>
              </>
            ) : (
              <>
                <svg
                  className="w-24 h-24 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p className="text-sm">No photo yet</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Name at bottom */}
      {!isLarge && (
        <div className="bg-white px-2 mt-3 text-center">
          <p className="text-gray-700 font-semibold">{employee.name}</p>
        </div>
      )}
    </div>
  );
}
