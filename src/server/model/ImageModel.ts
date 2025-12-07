import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

export class ImageModel {
    private static readonly defaultPath = "public/images";
    private static readonly defaultExtension = "webp";

    static async save(base64: string, name: string): Promise<string> {
        let contentType = "image/png";
        let rawBase64Data = base64;
        const dataUrlMatch = /^data:(image\/[a-zA-Z+.-]+);base64,(.*)$/.exec(
            base64,
        ); // holy regex
        if (dataUrlMatch) {
            contentType = dataUrlMatch[1];
            rawBase64Data = dataUrlMatch[2];
        }
        if (!/^image\/[a-zA-Z+.-]+$/.test(contentType)) {
            throw new Error("Invalid image content type");
        }

        const buffer = Buffer.from(rawBase64Data, "base64");
        const safeName = (name || "file").replace(/[^a-zA-Z0-9._-]/g, "_").trim();
        const baseName = path.basename(safeName, path.extname(safeName));
        const filename = `${Date.now()}_${baseName}.${ImageModel.defaultExtension}`;
        const fullPath = path.join(ImageModel.defaultPath, filename);

        if (!(await ImageModel.exists(ImageModel.defaultPath))) {
            await fs.mkdir(ImageModel.defaultPath, { recursive: true });
        }

        await sharp(buffer, { animated: true })
            .resize(180, 180)
            .webp()
            .toFile(fullPath);

        return fullPath;
    }

    static async delete(uri: string): Promise<void> {
        return fs.unlink(uri).catch((err: NodeJS.ErrnoException) => {
            if (err && err.code === "ENOENT") {
                return Promise.resolve();
            } else {
                return Promise.reject(err);
            }
        });
    }

    static async exists(uri: string): Promise<boolean> {
        return fs
            .access(uri)
            .then(() => true)
            .catch(() => false);
    }
}
