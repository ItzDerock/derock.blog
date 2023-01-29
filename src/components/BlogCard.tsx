import { A } from "solid-start";

export type BlogProps = {
  post: {
    title: string;
    description: string;
    id: string;
    date: string;
    tags: string[];
    image: string;
    slug: string;
  };
}

export default function BlogCard(props: BlogProps) {
  const blog = props.post;

  return (
    <A href={`/post/${encodeURIComponent(blog.slug)}`}>
      <section class="card cursor-pointer flex flex-col relative h-full">
        <div class="rounded-md flex flex-col grow p-[10px] z-[2] h-full card-content">
          {/* image */}
          <img
            loading="lazy"
            src={blog.image}
            alt={blog.title}
            class="w-full h-64 object-cover rounded-md"
          />

          {/* tags */}
          <div class="flex flex-wrap gap-2 mt-2">
            {/* date */}
            <span class="text-xs text-gray-500">{blog.date}</span>

            {/* divider */}
            <span class="text-xs text-gray-500">•</span>

            {/* tags */}
            {blog.tags.map((tag) => (
              <span class="text-xs text-gray-500">{tag}</span>
            ))}
          </div>

          {/* title */}
          <h2 class="text-xl font-bold mt-2">{blog.title}</h2>

          {/* description */}
          <p>{blog.description}</p>
        </div>
      </section>
    </A>
  )
}
