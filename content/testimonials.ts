export type Testimonial = { quote: string; name: string; role: string; company: string; permissionDate: string };

// Real quotes only, added with the client's written permission.
// The testimonials section renders only when this list is non-empty.
export const testimonials: Testimonial[] = [];
