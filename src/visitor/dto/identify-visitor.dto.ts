import {IdDto} from "../../common/dto/id.dto";
import {IsVisitorExist} from "../decorator/is-visitor-exist.decorator";

export class IdentifyVisitorDto extends IdDto{
    @IsVisitorExist()
    id: number;
}