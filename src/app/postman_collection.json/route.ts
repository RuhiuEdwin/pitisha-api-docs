import { buildPostman } from "@/lib/postman";

export const dynamic = "force-static";
export const GET = () => new Response(JSON.stringify(buildPostman(), null, 2), { headers: { "content-type": "application/json", "content-disposition": 'attachment; filename="tefo.postman_collection.json"' } });
