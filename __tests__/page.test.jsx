import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Home from "@/app/[locale]/page";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

// TODO fix this as getMessages is not supported in client components
const locale = "en";
const messages = {
  HomePage: {
    welcome: "Welcome!",
  },
};

describe("Page", () => {
  it("renders a heading", () => {
    render(
      <NextIntlClientProvider locale={locale} messages={messages}>
        <Home />
      </NextIntlClientProvider>,
    );
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
  });
});
