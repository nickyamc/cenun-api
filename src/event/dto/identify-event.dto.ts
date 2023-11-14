import {IdDto} from "../../common/dto/id.dto";
import {IsEventExist} from "../decorator/is-event-exist.decorator";

export class IdentifyEventDto extends IdDto {
    @IsEventExist()
    id: number;
}