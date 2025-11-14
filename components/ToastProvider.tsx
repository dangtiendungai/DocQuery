"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastProvider() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      toastClassName="!font-sans !bg-slate-900 !border !border-white/10 !text-slate-100 !rounded-lg !shadow-lg"
      progressClassName="!bg-emerald-400"
      closeButton={true}
    />
  );
}

