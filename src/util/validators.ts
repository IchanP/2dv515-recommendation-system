export function recommendApiParamsValidation(url: string) {
  const { searchParams } = new URL(url);
  const user = searchParams.get("user");
  const nrOfResults = searchParams.get("results");

  if (!user || !nrOfResults || !Number(user) || !Number(nrOfResults))
    throw new Error();

  return { user: user, nrOfResults: nrOfResults };
}

type AcceptableValues = {
  [key: string]: string;
};

export function simTypeParamValidation(
  url: string,
  acceptableValues: AcceptableValues,
) {
  const { searchParams } = new URL(url);
  const simType = searchParams.get("simtype");
  for (const acceptableValue of Object.values(acceptableValues)) {
    if (simType === acceptableValue) return simType;
  }
}
