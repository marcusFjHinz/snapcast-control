import axios from "axios";

export class yascui_service {

    constructor(private href: string) {

    }

    get_config = async () => {
        try {
            const config = await axios({
                url: this.href + 'get_config',
                method: 'get',
                timeout: 8000,
            })
            return config.data;
        } catch (err) {
            console.error(err);
        }

    }
    // eslint-disable-next-line
    write_config = async (new_config: any) => {
        try {
            await axios({
                url: this.href,
                method: 'post',
                timeout: 8000,
                data: new_config
            })
        } catch (err) {
            console.error(err);
        }
    }
}