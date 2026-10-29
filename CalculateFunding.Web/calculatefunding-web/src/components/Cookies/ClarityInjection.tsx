import React, { useEffect, useState } from "react";
import Clarity from "@microsoft/clarity";
import axios from "axios";

interface ClarityProps {
  cookieConsent: boolean | null;
}
const ClarityInjection: React.FC<ClarityProps> = ({ cookieConsent }) => {
   const [clarityKey, setClarityKey] = useState<string | null>(null);

  useEffect(() => {
      const fetchClarityKeys = async () => {
        try {
          const response = await axios.get("/api/clarity/get-clarity-key");
          setClarityKey(response.data.clarityKey);
        } catch (error) {
          console.error("Error fetching Clarity Key:", error);
        }
      };
      fetchClarityKeys();
  }, [clarityKey]);

  useEffect(() => {
    if (cookieConsent === true && clarityKey) {
      // Initialize Clarity tracking
      Clarity.init(clarityKey);
      if (window.clarity){
          window.clarity("consent");
          console.log("Clarity tracking started with key:", clarityKey);
        }
      } else if (cookieConsent === false && window.clarity) {
          window.clarity("consent", false);
          window.clarity("stop");
        console.log("Clarity consent set to false - Clarity Tracking stopped.");
      }
  }, [cookieConsent, clarityKey]);

  return null;
};

export default ClarityInjection;
