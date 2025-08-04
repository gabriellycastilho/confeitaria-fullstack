import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Middleware para upload de arquivos usando multer
// Configura o armazenamento dos arquivos enviados
// Define o destino e o nome do arquivo com base no timestamp e no nome original
// Utiliza a pasta "uploads" dentro do diretório do backend para armazenar os arquivos
// O nome do arquivo é gerado com o timestamp atual para evitar conflitos
// Exporta o middleware de upload para ser usado nas rotas

// Configura o caminho absoluto para salvar os arquivos
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define o destino e o nome do arquivo
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "..", "uploads")); // pasta uploads dentro do backend
  },
  filename: function (req, file, cb) {
    const nomeArquivo = `${Date.now()}-${file.originalname}`;
    cb(null, nomeArquivo);
  },
});

// Cria o middleware de upload
export const upload = multer({ storage });
