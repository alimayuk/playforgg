'use client';

import React from 'react';
import { MDXEditor } from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

import {
    headingsPlugin,
    quotePlugin,
    listsPlugin,
    codeBlockPlugin,
    linkPlugin,
    imagePlugin,
    tablePlugin,
    markdownShortcutPlugin,
    frontmatterPlugin,
    toolbarPlugin,
    BoldItalicUnderlineToggles,
    BlockTypeSelect,
    ListsToggle,
    CodeToggle,
    CreateLink,
    InsertImage,
    InsertTable,
    Separator
} from '@mdxeditor/editor';

const Page = () => {
    return (
        <div className="p-4">
            <MDXEditor
                markdown=""
                plugins={[
                    headingsPlugin(),        // Başlık desteği
                    quotePlugin(),           // Alıntı desteği
                    listsPlugin(),           // Liste desteği (gerekli!)
                    codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
                    linkPlugin(),
                    imagePlugin({
                        imageUploadHandler: async (file: File) => {
                            // Örnek: Görseli bir API’ye yolla
                            const formData = new FormData();
                            formData.append('file', file);

                            const res = await fetch('/api/upload', {
                                method: 'POST',
                                body: formData,
                            });

                            const data = await res.json();

                            // API'den gelen görselin URL'si
                            return data.url; // örnek: https://cdn.site.com/uploads/image.jpg
                        },
                    }),
                    tablePlugin(),
                    markdownShortcutPlugin(),
                    frontmatterPlugin(),
                    toolbarPlugin({
                        toolbarContents: () => (
                            <>
                                <BoldItalicUnderlineToggles />
                                <Separator />
                                <BlockTypeSelect />         {/* Başlık/paragraf tipi */}
                                <Separator />
                                <ListsToggle />             {/* Madde / numaralı liste */}
                                <Separator />
                                <CodeToggle />
                                <Separator />
                                <CreateLink />
                                <InsertImage />
                                <InsertTable />
                            </>
                        ),
                    }),
                ]}
            />
        </div>
    );
};

export default Page;
