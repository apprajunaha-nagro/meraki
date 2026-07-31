import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

const saveSeedPlugin = () => ({
  name: 'save-seed-plugin',
  configureServer(server: any) {
    server.middlewares.use(async (req: any, res: any, next: any) => {
      if (req.url === '/api/dev/save-seed' && req.method === 'POST') {
        try {
          let body = '';
          for await (const chunk of req) {
            body += chunk;
          }
          const { products } = JSON.parse(body);
          const mockDataPath = path.resolve(__dirname, 'src/lib/mockData.ts');
          let mockContent = fs.readFileSync(mockDataPath, 'utf8');

          const processedProducts = products.map((prod: any) => {
            if (prod.images && prod.images.length > 0) {
              prod.images = prod.images.map((img: any) => {
                if (img.image_url && img.image_url.startsWith('data:image/')) {
                  const matches = img.image_url.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
                  if (matches && matches.length === 3) {
                    const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
                    const base64Data = matches[2];
                    const fileName = `product-uploaded-${prod.id}-${img.id}.${ext}`;
                    const filePath = path.resolve(__dirname, 'public', fileName);
                    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
                    img.image_url = `/${fileName}`;
                  }
                }
                return img;
              });
            }
            return prod;
          });

          const productsStartMarker = 'export const products: Product[] = [';
          const productsEndMarker = 'export const curatedEdits = [';

          const startIdx = mockContent.indexOf(productsStartMarker);
          const endIdx = mockContent.indexOf(productsEndMarker);

          if (startIdx !== -1 && endIdx !== -1) {
            const beforePart = mockContent.substring(0, startIdx + productsStartMarker.length);
            const afterPart = mockContent.substring(endIdx);

            const productsString = '\n' + processedProducts.map((p: any) => {
              const pClean = { ...p };
              delete pClean.category;
              return `  {
    id: ${pClean.id},
    name: ${JSON.stringify(pClean.name)},
    slug: ${JSON.stringify(pClean.slug)},
    description: ${JSON.stringify(pClean.description)},
    fabric: ${JSON.stringify(pClean.fabric)},
    care_instructions: ${JSON.stringify(pClean.care_instructions)},
    category_id: ${pClean.category_id},
    category: categories[${pClean.category_id - 1}],
    base_price: ${pClean.base_price},
    mrp: ${pClean.mrp},
    sku: ${JSON.stringify(pClean.sku)},
    status: ${JSON.stringify(pClean.status)},
    is_featured: ${pClean.is_featured},
    is_bestseller: ${pClean.is_bestseller},
    is_new_arrival: ${pClean.is_new_arrival},
    rating: ${pClean.rating},
    review_count: ${pClean.review_count},
    tags: ${JSON.stringify(pClean.tags)},
    created_at: ${JSON.stringify(pClean.created_at)},
    variants: ${JSON.stringify(pClean.variants, null, 6)},
    images: ${JSON.stringify(pClean.images, null, 6)}
  }`;
            }).join(',\n') + '\n];\n\n';

            mockContent = beforePart + productsString + afterPart;
            fs.writeFileSync(mockDataPath, mockContent, 'utf8');
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true }));
          return;
        } catch (err) {
          console.error('Error saving seed:', err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: (err as any).message }));
          return;
        }
      }
      next();
    });
  }
});

export default defineConfig({
  plugins: [react(), saveSeedPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('recharts') || id.includes('d3-')) return 'charts';
          if (id.includes('lucide-react') || id.includes('embla-carousel')) return 'ui';
          if (id.includes('node_modules')) return 'vendor';
        },
      },
    },
  },
});