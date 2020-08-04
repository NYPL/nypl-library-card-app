import { constructAddresses, AddressesType } from "../api";

describe("constructAddresses", () => {
  test("it returns an empty AddressType object with no input", () => {
    const empty: AddressesType = constructAddresses();

    expect(empty).toStrictEqual({ home: {}, work: {} });
  });

  test("returns an updated home address object property", () => {
    const formData = {
      "home-line1": "3747 61st St",
      "home-line2": "",
      "home-city": "Woodside",
      "home-state": "NY",
      "home-zip": "11377",
    };
    const addresses: AddressesType = constructAddresses(formData);

    expect(addresses.home).toEqual({
      line1: "3747 61st St",
      line2: "",
      city: "Woodside",
      state: "NY",
      zip: "11377",
    });
  });

  test("returns an updated work address object property", () => {
    const formData = {
      "work-line1": "476 5th Avenue",
      "work-line2": "",
      "work-city": "New York",
      "work-state": "NY",
      "work-zip": "10018",
    };
    const addresses: AddressesType = constructAddresses(formData);

    expect(addresses.work).toEqual({
      line1: "476 5th Avenue",
      line2: "",
      city: "New York",
      state: "NY",
      zip: "10018",
    });
  });

  test("returns updated home and work addresses objects", () => {
    const formData = {
      "home-line1": "3747 61st St",
      "home-line2": "",
      "home-city": "Woodside",
      "home-state": "NY",
      "home-zip": "11377",
      "work-line1": "476 5th Avenue",
      "work-line2": "",
      "work-city": "New York",
      "work-state": "NY",
      "work-zip": "10018",
    };
    const addresses: AddressesType = constructAddresses(formData);

    expect(addresses).toEqual({
      home: {
        line1: "3747 61st St",
        line2: "",
        city: "Woodside",
        state: "NY",
        zip: "11377",
      },
      work: {
        line1: "476 5th Avenue",
        line2: "",
        city: "New York",
        state: "NY",
        zip: "10018",
      },
    });
  });
});