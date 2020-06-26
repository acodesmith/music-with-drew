const API = "https://gosdw0hrpa.execute-api.us-east-1.amazonaws.com";
const S3_PUBLIC = "https://music-with-you.s3.amazonaws.com";

export const getSignedUrls = async (name) => {};

export const getSignedUploadUrl = async (name) => {
  try {
    const url = new URL(`${API}/url`);
    const params = { name };

    url.search = new URLSearchParams(params).toString();

    const data = await fetch(url, { mode: "cors" });

    return data.json();
  } catch (e) {
    // @todo handle error
    console.log("e", e);
  }
};

export const uploadCsv = async (presignedUrl, file) => {
  try {
    return await fetch(presignedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "text/csv",
      },
      body: file,
    });
  } catch (e) {
    console.error(e);
  }
};

export const uploadDetails = async (presignedUrl, details) => {
  try {
    return await fetch(presignedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: details,
    });
  } catch (e) {
    console.error(e);
  }
};

export const getFilePath = (id) => `${S3_PUBLIC}/${id}`;

export const getList = async (id) => {
  const csv = await fetch(getFilePath(id), {
    headers: {
      "Content-Type": "text/csv",
    },
  });

  if (csv.status !== 200) {
    throw new Error("List not found.");
  }

  return csv.text();
};
