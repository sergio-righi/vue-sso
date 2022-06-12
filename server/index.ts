import app from './app';
import { ConfigUtil } from "./utils";

const PORT = ConfigUtil.get('http.port');

app.listen(PORT, () => console.log(`server running at ${PORT}`))