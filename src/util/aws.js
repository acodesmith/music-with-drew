const API = "https://gosdw0hrpa.execute-api.us-east-1.amazonaws.com";
const S3_PUBLIC = "https://music-with-you.s3.amazonaws.com";

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
      body: JSON.stringify(details),
    });
  } catch (e) {
    console.error(e);
  }
};

export const getFilePath = (id, ext) => `${S3_PUBLIC}/${id}.${ext}`;

export const getList = async (id) => {
  const csvData = await fetch(getFilePath(id, "csv"), {
    headers: {
      "Content-Type": "text/csv",
    },
  });
  const infoData = await fetch(getFilePath(id, "json"), {
    headers: {
      "Content-Type": "text/csv",
    },
  });

  if (csvData.status !== 200 || infoData.status !== 200) {
    throw new Error("List not found.");
  }

  const csv = await csvData.text();
  const info = await infoData.json();

  return { csv, info };
};
