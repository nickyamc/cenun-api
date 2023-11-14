import {IdDto} from "../../common/dto/id.dto";
import {IsLabExist} from "../decorator/is-lab-exist.decorator";

export class IdentifyLabDto extends IdDto {
    @IsLabExist()
    id: number;
}