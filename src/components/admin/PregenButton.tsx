"use client";

const PregenButton = () => {
  const sendPregenRequest = async () => {
    const response = await fetch("/api/pregen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      // TODO set a state message saying it succeeded
    } else {
      // TODO set a state error message
    }
  };

  return (
    <>
      <button
        onClick={sendPregenRequest}
        className="bg-lightSecondary hover:bg-lightHover hover:dark:bg-darkHover dark:bg-darkSecondary p-5 rounded-md"
      >
        Pre-generate Table
      </button>
    </>
  );
};

export default PregenButton;
