const API_BASE_URL = "http://127.0.0.1:8000";

export interface PalmUploadResponse {
  id: number;
  image_name: string;
  image_path: string;
  image_size: number;
  image_format: string;
  status: string;
  analysis_status: string;
  uploaded_at: string;
}

export interface PalmAnalysisResponse {
  id: number;
  user_id: number;
  hand: string;
  features: Record<string, number>;
  interpretation: Record<string, string>;
  image_path: string;
}

export async function uploadPalmImage(
  file: File,
  token: string,
): Promise<PalmUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/v1/palm/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Palm upload failed (${response.status}): ${errorText}`);
  }

  return response.json();
}

export async function analyzePalmImage(
  imageId: number,
  token: string,
): Promise<PalmAnalysisResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/palm/analyze/${imageId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Palm analysis failed (${response.status}): ${errorText}`);
  }

  return response.json();
}
