import { useState } from "react";

const CreateReview = ({ id, setMessage, forceUpdate }) => {
  const [inputTitle, setTitle] = useState("");
  const [inputBody, setBody] = useState("");
  const [inputRating, setRating] = useState("4");
  const [error, setError] = useState("");
  const foodID = id;
  const URL = import.meta.env.VITE_API_URL;

  function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("userToken"); // Retrieve the token from local storage

    if (!token) {
      setError("You must be logged in to submit a review.");
      return;
    }

    async function postReview() {
      try {
        const res = await fetch(`${URL}/reviews`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
          body: JSON.stringify({
            title: inputTitle,
            content: inputBody,
            rating: inputRating,
            foodItem: foodID,
          }),
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Unable to submit the review.");
        }
        const postedReview = await res.json();
        setTitle("");
        setBody("");
        setRating("4");
        setMessage(postedReview.message || "Review submitted successfully!");
        forceUpdate();
      } catch (error) {
        console.error(error);
        setError(
          "Something went wrong with submitting the review. Please try again."
        );
      }
    }
    postReview();
  }

  return (
    <main className="w-3/5 bg-white border-2 border-black ml-auto mr-auto">
      <div className="max-w-4xl mx-auto p-8">
        <h2 className="text-2xl text-center font-bold underline mb-6">
          Write your own review!
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="review-title"
              className="block text-sm font-medium text-gray-700"
            >
              TITLE:
            </label>
            <input
              type="text"
              id="review-title"
              placeholder="Title"
              value={inputTitle}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="review-body"
              className="block text-sm font-medium text-gray-700"
            >
              YOUR REVIEW:
            </label>
            <textarea
              id="review-body"
              placeholder="Write your review..."
              value={inputBody}
              onChange={(e) => setBody(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center">
            <label
              htmlFor="review-rating"
              className="block text-sm font-medium text-gray-700 mr-3"
            >
              FOOD RATING:
            </label>
            <select
              id="review-rating"
              value={inputRating}
              onChange={(e) => setRating(e.target.value)}
              className="mt-1 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md w-36"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          <input
            type="submit"
            value="SUBMIT REVIEW"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
      </div>
    </main>
  );
};

export default CreateReview;
