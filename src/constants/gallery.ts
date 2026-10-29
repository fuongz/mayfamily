import type { GalleryItem, HomeImage } from "@/types"

/*
 * Photo lists, kept in the repo. The images themselves are served from the
 * CDN (absolute `file_url`s); only the lists live here.
 */

/** The wedding photo shoot (concepts 01–08), shared by both wedding moments. */
export const WEDDING_GALLERY: readonly GalleryItem[] = [
  { id: "4c052e6d-c36b-489f-8e58-75cf9e3b44d3", type: "portrait", has_large_size: false, folder: 1, filename: "image-04.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-01/image-04.jpg" },
  { id: "11a9b161-68e7-4b7d-9909-463a7574a481", type: "portrait", has_large_size: false, folder: 1, filename: "image-05.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-01/image-05.jpg" },
  { id: "10a9dca0-b856-464b-969d-e48a90f016c7", type: "portrait", has_large_size: false, folder: 1, filename: "image-07.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-01/image-07.jpg" },
  { id: "f080355f-93c0-4a58-ba17-47d5a2b51282", type: "portrait", has_large_size: false, folder: 1, filename: "image-06.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-01/image-06.jpg" },
  { id: "7c883c05-db74-48ef-b75b-135bb8cdacba", type: "portrait", has_large_size: false, folder: 1, filename: "image-02.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-01/image-02.jpg" },
  { id: "accd14f3-deb9-4f71-9021-1b9aae6ab7a4", type: "portrait", has_large_size: false, folder: 1, filename: "image-03.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-01/image-03.jpg" },
  { id: "78082a40-aa24-4cbe-bd14-270d34a94db7", type: "portrait", has_large_size: false, folder: 1, filename: "image-01.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-01/image-01.jpg" },
  { id: "98d6da45-67d4-4905-91a7-2cf1388fb0c7", type: "portrait", has_large_size: false, folder: 2, filename: "image-08.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-02/image-08.jpg" },
  { id: "251ad350-1438-4840-9f3b-b0ee02a12879", type: "portrait", has_large_size: false, folder: 2, filename: "image-09.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-02/image-09.jpg" },
  { id: "79a57be6-b6b9-4183-b69d-55082f4b3068", type: "portrait", has_large_size: false, folder: 2, filename: "image-04.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-02/image-04.jpg" },
  { id: "2f8a0289-fd4d-4923-9344-20bc800eeb11", type: "landscape", has_large_size: true, folder: 2, filename: "image-12.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-02/image-12.jpg" },
  { id: "e0eeb44d-0bb8-4a79-9b88-ee52bf70d03b", type: "portrait", has_large_size: false, folder: 2, filename: "image-10.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-02/image-10.jpg" },
  { id: "b9859195-c265-40b8-b541-74cce93a2581", type: "landscape", has_large_size: true, folder: 2, filename: "image-11.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-02/image-11.jpg" },
  { id: "7102878d-2d36-482a-99db-099a4d1af969", type: "portrait", has_large_size: false, folder: 2, filename: "image-05.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-02/image-05.jpg" },
  { id: "8c769396-338a-4196-a904-d33905a96bb3", type: "portrait", has_large_size: false, folder: 2, filename: "image-07.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-02/image-07.jpg" },
  { id: "d6934804-7766-4e5f-b1ea-045d1f9d8047", type: "portrait", has_large_size: false, folder: 2, filename: "image-06.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-02/image-06.jpg" },
  { id: "56720803-11d4-47c2-b361-042c2d5fa7f7", type: "portrait", has_large_size: false, folder: 2, filename: "image-02.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-02/image-02.jpg" },
  { id: "692494bd-5e04-42e0-aad4-05748dca0f50", type: "portrait", has_large_size: false, folder: 2, filename: "image-03.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-02/image-03.jpg" },
  { id: "4069534e-0948-4214-9b33-be25e030ef97", type: "portrait", has_large_size: false, folder: 2, filename: "image-01.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-02/image-01.jpg" },
  { id: "e4419991-48c2-4131-ac95-686a567bd648", type: "portrait", has_large_size: false, folder: 3, filename: "image-04.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-03/image-04.jpg" },
  { id: "eb5eddb8-d521-40ba-93cd-7aa9d944bddb", type: "portrait", has_large_size: false, folder: 3, filename: "image-05.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-03/image-05.jpg" },
  { id: "0da893ec-d808-4f06-9363-5438ec84fecb", type: "portrait", has_large_size: false, folder: 3, filename: "image-02.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-03/image-02.jpg" },
  { id: "babd2f61-2d1e-47a2-9554-5faa55e80e53", type: "portrait", has_large_size: false, folder: 3, filename: "image-03.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-03/image-03.jpg" },
  { id: "1fb8eb80-87e0-49a3-aee4-1aad8ee842d8", type: "portrait", has_large_size: false, folder: 3, filename: "image-01.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-03/image-01.jpg" },
  { id: "ab0407c5-4317-4870-ba0f-d98720e6c509", type: "portrait", has_large_size: false, folder: 4, filename: "image-02.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-04/image-02.jpg" },
  { id: "eb655623-5d7c-48ed-a496-f2939acd462e", type: "portrait", has_large_size: false, folder: 4, filename: "image-01.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-04/image-01.jpg" },
  { id: "1d241a45-0e8c-4d36-8ed1-a30c7afaa0e8", type: "portrait", has_large_size: false, folder: 5, filename: "image-04.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-05/image-04.jpg" },
  { id: "591ad0bb-effb-4d56-8b84-e6ee029e5657", type: "portrait", has_large_size: false, folder: 5, filename: "image-05.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-05/image-05.jpg" },
  { id: "fbca72b7-6119-4afd-82e9-b85da224afc8", type: "portrait", has_large_size: false, folder: 5, filename: "image-06.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-05/image-06.jpg" },
  { id: "2f3f3000-6b70-4478-90ad-366e5d2cba60", type: "portrait", has_large_size: false, folder: 5, filename: "image-02.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-05/image-02.jpg" },
  { id: "9f118c1d-59d5-40ef-ae5c-569a249acd8c", type: "portrait", has_large_size: false, folder: 5, filename: "image-03.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-05/image-03.jpg" },
  { id: "e8b1f293-2b53-4702-9b2d-8ceea50d47c3", type: "portrait", has_large_size: false, folder: 5, filename: "image-01.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-05/image-01.jpg" },
  { id: "3eacd1b5-15d0-43d2-9860-0f4158e5ded1", type: "landscape", has_large_size: true, folder: 6, filename: "image-13.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-06/image-13.jpg" },
  { id: "99e629a6-f14b-410a-acea-1ca14595af0f", type: "portrait", has_large_size: false, folder: 6, filename: "image-02.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-06/image-02.jpg" },
  { id: "0822d24a-eb3d-48b1-89fb-1237cecfc825", type: "portrait", has_large_size: false, folder: 6, filename: "image-03.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-06/image-03.jpg" },
  { id: "597709a1-074f-4680-abe4-bf614557d263", type: "portrait", has_large_size: false, folder: 6, filename: "image-01.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-06/image-01.jpg" },
  { id: "f8e54413-f93f-4258-b008-7eb198c4edc8", type: "portrait", has_large_size: false, folder: 7, filename: "image-04.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-07/image-04.jpg" },
  { id: "7fb1124e-9e77-47e8-8521-42d8f0ebcd8a", type: "portrait", has_large_size: false, folder: 7, filename: "image-02.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-07/image-02.jpg" },
  { id: "a516248f-fbb4-431c-b99e-6d80890bfd15", type: "portrait", has_large_size: false, folder: 7, filename: "image-03.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-07/image-03.jpg" },
  { id: "07bee3d9-075c-4a69-a323-31d8de22f934", type: "portrait", has_large_size: false, folder: 7, filename: "image-01.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-07/image-01.jpg" },
  { id: "57ab0fe1-c5a1-478c-9b66-24808953890e", type: "portrait", has_large_size: false, folder: 8, filename: "image-04.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-08/image-04.jpg" },
  { id: "73cb786b-176a-409f-970b-814661b20644", type: "portrait", has_large_size: false, folder: 8, filename: "image-02.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-08/image-02.jpg" },
  { id: "4178b7f5-fac7-4e36-af59-cfa8f4a68970", type: "portrait", has_large_size: false, folder: 8, filename: "image-03.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-08/image-03.jpg" },
  { id: "33f04c30-093d-41a9-b5c0-781388be3a81", type: "portrait", has_large_size: false, folder: 8, filename: "image-01.jpg", file_url: "https://cdn.trinhvaphuong.com/concept-08/image-01.jpg" },
]

/** The few photos on the home page ring. */
export const HOME_IMAGES: readonly HomeImage[] = [
  { id: "fdb075a9-802f-4de2-acb0-dc12a63825e1", filename: "image-04.jpg", file_url: "https://cdn.trinhvaphuong.com/home/image-04.jpg" },
  { id: "fee4b3c6-4e47-4622-965b-55f2622f0e5f", filename: "image-05.jpg", file_url: "https://cdn.trinhvaphuong.com/home/image-05.jpg" },
  { id: "4ab35ea5-58df-40ac-a331-2a137e34bf94", filename: "image-02.jpg", file_url: "https://cdn.trinhvaphuong.com/home/image-02.jpg" },
  { id: "a85463bc-57fa-4d8f-9a90-ad05a12b7d1c", filename: "image-03.jpg", file_url: "https://cdn.trinhvaphuong.com/home/image-03.jpg" },
  { id: "c655f403-9816-4f6b-8632-533c7d8b6656", filename: "image-01.jpg", file_url: "https://cdn.trinhvaphuong.com/home/image-01.jpg" },
]
