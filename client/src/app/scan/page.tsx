// app/scan/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useVerifyMember } from "@/hooks/useVerifyMember";
import { Loader2, CameraOff, AlertCircle, RefreshCw } from "lucide-react";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";

export default function QRScannerPage() {
  const { mutate: verify, isPending } = useVerifyMember();
  const [scanned, setScanned] = useState(false);
  const [scannerStatus, setScannerStatus] = useState<
    "initializing" | "ready" | "scanning" | "error"
  >("initializing");
  const [errorDetails, setErrorDetails] = useState<{
    title: string;
    message: string;
    action?: string;
    icon: React.ReactNode;
  } | null>(null);

  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    let scanner: Html5QrcodeScanner;

    const initScanner = async () => {
      try {
        // Pre-check camera permission (if supported)
        if ("permissions" in navigator) {
          const permissionStatus = await navigator.permissions.query({
            name: "camera" as PermissionName,
          });

          if (permissionStatus.state === "denied") {
            throw new Error("Camera permission permanently denied.");
          }
        }

        // Check available cameras
        const devices = await Html5Qrcode.getCameras();
        if (!devices || devices.length === 0) {
          throw new Error("No camera found on this device.");
        }

        scanner = new Html5QrcodeScanner(
          "reader",
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1,
            supportedScanTypes: [0], // SCAN_TYPE_CAMERA
          },
          false,
        );

        scanner.render(onScanSuccess, onScanFailure);
        scannerRef.current = scanner;
        setScannerStatus("ready");
        setErrorDetails(null);
      } catch (err) {
        // Safely handle unknown error
        handleCameraError(err);
      }
    };

    const onScanSuccess = (decodedText: string) => {
      if (!decodedText || scanned) return;
      setScanned(true);

      scannerRef.current?.clear();
      setScannerStatus("scanning");
      verify(decodedText, {
        onSettled: () => {
          setTimeout(() => setScannerStatus("ready"), 2000);
        },
      });
    };

    const onScanFailure = (error: string) => {
      // Ignore normal "no QR found" errors
      if (
        error.includes("No MultiCode detected") ||
        error.includes("QR code parse error") ||
        error.includes("No code")
      ) {
        return;
      }

      console.warn("Scan failure:", error);
      // Forward real camera errors
      if (error.includes("NotAllowedError") || error.includes("Permission")) {
        handleCameraError(new Error("Camera access was blocked by the user."));
      } else if (error.includes("NotFoundError")) {
        handleCameraError(new Error("Camera not found or inaccessible."));
      } else if (
        error.includes("OverconstrainedError") ||
        error.includes("in use")
      ) {
        handleCameraError(
          new Error("Camera is already in use by another application."),
        );
      }
    };

    // Type-safe error handler
    const handleCameraError = (error: unknown) => {
      console.error("QR Scanner Error:", error);

      const errMessage = error instanceof Error ? error.message : String(error);

      let title = "Camera Access Required";
      let message = "We need permission to use your camera to scan QR codes.";
      let action = "Please allow camera access when prompted.";
      let icon = <CameraOff className="h-16 w-16 text-red-500" />;

      if (errMessage.includes("denied") || errMessage.includes("blocked")) {
        title = "Camera Permission Denied";
        message = "Camera access is blocked for this website.";
        action =
          "Go to browser settings → Privacy & Security → Camera → Allow this site";
        icon = <AlertCircle className="h-16 w-16 text-red-500" />;
      } else if (
        errMessage.includes("No camera") ||
        errMessage.includes("not found")
      ) {
        title = "No Camera Detected";
        message = "This device doesn't have an available camera.";
        action = "Please use a device with a working camera.";
        icon = <CameraOff className="h-16 w-16 text-orange-500" />;
      } else if (
        errMessage.includes("in use") ||
        errMessage.includes("Overconstrained")
      ) {
        title = "Camera In Use";
        message = "The camera is currently being used by another app or tab.";
        action = "Close other apps or tabs using the camera and try again.";
        icon = <AlertCircle className="h-16 w-16 text-yellow-500" />;
      }

      setErrorDetails({ title, message, action, icon });
      setScannerStatus("error");
    };

    initScanner();

    return () => {
      scannerRef.current?.clear().catch(() => {});
      scannerRef.current = null;
    };
  }, []);

  const reloadScanner = () => {
    window.location.reload();
  };

  // Error UI
  if (scannerStatus === "error" && errorDetails) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-900 px-8 text-center text-white">
        <div className="max-w-md">
          <div className="flex justify-center"> {errorDetails.icon}</div>

          <h2 className="mt-8 text-3xl font-bold text-white">
            {errorDetails.title}
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-slate-300">
            {errorDetails.message}
          </p>

          {errorDetails.action && (
            <p className="mt-4 text-sm text-slate-400">{errorDetails.action}</p>
          )}

          <Button
            onClick={reloadScanner}
            className="mt-4 w-full rounded-none px-6 py-6"
          >
            <RefreshCw className="h-5 w-5" />
            Try Again
          </Button>
        </div>

        <footer className="absolute bottom-6 text-xs text-slate-500">
          Brothers Gym • Access Control System
        </footer>
      </div>
    );
  }

  // Main UI
  return (
    <div className="flex h-screen flex-col bg-slate-900 text-white">
      <div className="pt-12 text-center">
        <h1 className="text-6xl font-black tracking-tight text-emerald-500">
          BROTHERS GYM
        </h1>
        <p className="mt-3 text-lg text-slate-400">Scan Member QR Code</p>
      </div>

      <div className="relative flex-1 px-8 py-12">
        <div className="flex h-full flex-col items-center justify-center">
          <div
            id="reader"
            className="h-80 w-80 overflow-hidden rounded-3xl border-4 border-slate-800 bg-black shadow-2xl"
          />

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="relative h-80 w-80">
              <div className="absolute inset-0 rounded-3xl border-4 border-emerald-500/70 shadow-2xl shadow-emerald-500/30" />
              {[
                "top-0 left-0 border-t-8 border-l-8 rounded-tl-3xl",
                "top-0 right-0 border-t-8 border-r-8 rounded-tr-3xl",
                "bottom-0 left-0 border-b-8 border-l-8 rounded-bl-3xl",
                "bottom-0 right-0 border-b-8 border-r-8 rounded-br-3xl",
              ].map((cls, i) => (
                <div
                  key={i}
                  className={`absolute h-32 w-32 border-emerald-500 ${cls}`}
                />
              ))}
            </div>
          </div>

          <p className="absolute bottom-32 text-2xl font-bold tracking-wider text-emerald-400 drop-shadow-lg">
            ALIGN QR CODE
          </p>

          {scannerStatus === "initializing" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
              <Loader2 className="h-12 w-12 animate-spin text-emerald-400" />
              <p className="mt-4 text-lg text-slate-300">Starting camera...</p>
            </div>
          )}
        </div>

        {isPending && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md">
            <div className="text-center">
              <div className="relative">
                <div className="h-32 w-32 animate-pulse rounded-full bg-emerald-500/20" />
                <div className="absolute inset-4 rounded-full bg-emerald-600/30" />
                <div className="absolute inset-8 rounded-full bg-emerald-500/40" />
                <Loader2 className="absolute inset-0 m-auto h-16 w-16 animate-spin text-emerald-400" />
              </div>

              <h2 className="mt-12 text-4xl font-bold tracking-widest text-emerald-400">
                VERIFYING
              </h2>
              <p className="mt-4 text-lg text-slate-300">
                Checking membership status...
              </p>
            </div>
          </div>
        )}
      </div>

      <footer className="pb-6 text-center text-xs text-slate-500">
        Brothers Gym Access Control System
      </footer>
    </div>
  );
}
