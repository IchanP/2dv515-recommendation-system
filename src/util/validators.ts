export function recommendApiParamsValidation(url: string) {
  const { searchParams } = new URL(url);
  const user = searchParams.get("user");
  const nrOfResults = searchParams.get("results");

  if (!user || !nrOfResults || !Number(user) || !Number(nrOfResults))
    throw new Error();

  return { user: user, nrOfResults: nrOfResults };
}
