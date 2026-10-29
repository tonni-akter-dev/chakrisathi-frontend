import baseApi from "../../baseApi";

export type TestimonialUser = {
  id: number;
  name: string;
  image: string | null;
};

export type Testimonial = {
  id: number;
  title: string;
  message: string;
  designation: string | null;
  company: string | null;
  user: TestimonialUser | null;
};

export type TestimonialsResponse = {
  error: boolean;
  code: number;
  message: string;
  data: {
    data: Testimonial[];
  };
  errors: unknown;
};

const testimonialApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTestimonials: builder.query<TestimonialsResponse, void>({
      query: () => ({
        url: "/testimonials",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetTestimonialsQuery } = testimonialApi;

export default testimonialApi;
