"use client";

import { FormEvent, useState } from "react";
import FormParagraph from "./FormParagraph";

export declare type User = {
  UserId: number;
  Name: string;
};

declare type reccType = "item-based" | "user-based";

const recommendationTypes: { itemBased: reccType; userBased: reccType } = {
  itemBased: "item-based",
  userBased: "user-based",
};

const Recommender = ({ users }: { users: User[] }) => {
  const [selectedUser, setSelectedUser] = useState(users[0].UserId.toString());
  const [reccType, setReccType] = useState<reccType>(
    recommendationTypes.itemBased,
  );
  const [results, setResults] = useState("");

  // TODO might need state logic for grabbing the selector value.
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(selectedUser);
    console.log(reccType);
    console.log(results);
  };
  return (
    <div>
      <div className="mt-4 gap-2">
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="flex items-center justify-center flex-row">
            <FormParagraph text="User: " />
            <select
              className="ml-2 pl-2 border p-1"
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              {users.map((user) => (
                <option key={user.UserId} value={user.UserId}>
                  {user.UserId + ". " + user.Name}
                </option>
              ))}
            </select>

            <FormParagraph text="Type: " />
            <select
              className="ml-2 pl-2 border p-1"
              onChange={(e) => setReccType(e.target.value as reccType)}
            >
              <option value={recommendationTypes.itemBased}>Item Based</option>
              <option value={recommendationTypes.userBased}>User Based</option>
            </select>

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
      </div>
    </div>
  );
};

export default Recommender;
