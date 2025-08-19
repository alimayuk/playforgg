import { fetchApi } from "@/app/lib/fetchApi";

export const GeneralService = {

    toggleField: async (
        model: "category" | "blog" | "product" | "game" | "article",
        id: number,
        field: "status" | "featured"
    ): Promise<any> => {
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/toggle-field/${model}/${id}?field=${field}`;

        return fetchApi(url, {
            method: "PUT",
        });
    },
};
