import type {
  Dataset,
  FieldMapping,
} from "../app/(docs)/record-matching/types";

export const demoSource: Dataset = {
  name: "customers.csv",
  headers: ["customer_name", "email", "city"],
  rows: [
    {
      customer_name: "Rahul Sharma",
      email: "rahul.sharma@gmail.com",
      city: "Ahmedabad",
    },
    {
      customer_name: "Priya Patel",
      email: "priya.patel@gmail.com",
      city: "Surat",
    },
    {
      customer_name: "Amit Shah",
      email: "amit.shah@gmail.com",
      city: "Vadodara",
    },
    {
      customer_name: "Neha Joshi",
      email: "neha.joshi@gmail.com",
      city: "Rajkot",
    },
    {
      customer_name: "anuj pal",
      email: "kapadiya@gmail.com",
      city: "Surat",
    },
  ],
};

export const demoTarget: Dataset = {
  name: "customer_records.csv",
  headers: ["full_name", "email_address", "location"],
  rows: [
    {
      full_name: "Rahul S Sharma",
      email_address: "rahul.sharma@gmail.com",
      location: "Ahmedabad",
    },
    {
      full_name: "Priya P Patel",
      email_address: "priya.patel@gmail.com",
      location: "Surat",
    },
    {
      full_name: "Amit Shah",
      email_address: "amit.shah@gmail.com",
      location: "Vadodara",
    },
    {
      full_name: "Neha Joshi",
      email_address: "neha.j@gmail.com",
      location: "Rajkot",
    },
    {
      full_name: "Karan Mehta",
      email_address: "karan.mehta@gmail.com",
      location: "Ahmedabad",
    },
    {
      full_name: "Riya Desai",
      email_address: "riya.desai@gmail.com",
      location: "Gandhinagar",
    },
  ],
};

export const initialMappings: FieldMapping[] = [
  {
    id: 1,
    sourceKey: "customer_name",
    targetKey: "full_name",
    weight: 0.5,
  },
  {
    id: 2,
    sourceKey: "email",
    targetKey: "email_address",
    weight: 0.4,
  },
  {
    id: 3,
    sourceKey: "city",
    targetKey: "location",
    weight: 0.1,
  },
];
