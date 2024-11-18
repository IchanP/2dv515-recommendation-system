"use client";

import { FormEvent, useState } from "react";
import FormParagraph from "./FormParagraph";
import DataTable from "./DataTable";
import ErrorMessage from "./ErrorMessage";
import Selector from "./Selector";

export declare type User = {
  UserId: number;
  Name: string;
};

declare type reccType = "item-based" | "user-based";
declare type simType = "Euclidean" | "Pearson";

const recommendationTypes: { itemBased: reccType; userBased: reccType } = {
  itemBased: "item-based",
  userBased: "user-based",
};
const simTypes: { pearson: simType; euclidean: simType } = {
  pearson: "Pearson",
  euclidean: "Euclidean",
};

const headers = ["ID", "Title", "Score"];

const Recommender = ({ users }: { users: User[] }) => {
  const [selectedUser, setSelectedUser] = useState(users[0].UserId.toString());
  const [reccType, setReccType] = useState<reccType>(
    recommendationTypes.itemBased,
  );
  const [results, setResults] = useState("");

  const [recommendations, setRecommendations] = useState<
    Recommendation[] | null
  >(null);
  const [simType, setSimType] = useState<simType>(simTypes.euclidean);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Ensure user input is correct
    if (results.length === 0 || Number(results) < 1) {
      setErrorMessage("Please input a number bigger than 0.");
      return;
    }
    if (
      reccType === recommendationTypes.itemBased &&
      simType === simTypes.pearson
    ) {
      setErrorMessage("Pearson is only available for user-based comparisons");
      return;
    }

    // Build the request
    const endpoint =
      reccType === recommendationTypes.itemBased
        ? "/api/item-recommend"
        : "/api/user-recommend";

    const params = new URLSearchParams({
      user: selectedUser,
      results: results,
      simType: simType,
    }).toString();

    const response = await fetch(`${endpoint}?${params}`);
    if (response.ok) {
      const data = await response.json();
      const foundRecommendations: Recommendation[] = data.data;
      setRecommendations(foundRecommendations);
      setErrorMessage(null);
    } else {
      setErrorMessage("Something went wrong when fetching the data");
    }
  };

  return (
    <div>
      <div className="mt-4 gap-2">
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="flex items-center justify-center flex-row">
            <FormParagraph text="User: " />
            <Selector<string> setState={setSelectedUser}>
              {users.map((user) => (
                <option key={user.UserId} value={user.UserId}>
                  {user.UserId + ". " + user.Name}
                </option>
              ))}
            </Selector>

            <FormParagraph text="Type: " />
            <Selector<reccType> setState={setReccType}>
              <option value={recommendationTypes.itemBased}>Item Based</option>
              <option value={recommendationTypes.userBased}>User Based</option>
            </Selector>

            <FormParagraph text="Similarity" />
            <Selector<simType> setState={setSimType}>
              <option value={recommendationTypes.itemBased}>Euclidean</option>
              <option value={recommendationTypes.userBased}>Pearson</option>
            </Selector>

            <FormParagraph text="Results: " />
            <input
              className="w-1/6"
              type="text"
              value={results}
              onChange={(e) => setResults(e.target.value)}
            ></input>
          </div>
          <button
            className="mt-2 bg-lightSecondary dark:bg-darkSecondary px-2 py-1 rounded-md hover:bg-lightHover hover:dark:bg-darkHover"
            type="submit"
          >
            Submit
          </button>
        </form>
        <div className="flex flex-col items-center mt-5">
          {recommendations !== null && (
            <DataTable headers={headers} data={recommendations} />
          )}
        </div>
        <ErrorMessage text={errorMessage} />
      </div>
    </div>
  );
};

export default Recommender;
