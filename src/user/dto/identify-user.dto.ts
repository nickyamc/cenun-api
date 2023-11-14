
import {IsUserExist} from "../decorator/is-user-exist.decorator";
import {IdDto} from "../../common/dto/id.dto";
import {IsEntityExist} from "../../common/decorators/IsEntityExist.decorator";
import {IsUserExistConstraint} from "../validation/is-user-exist.validation";

export class IdentifyUserDto extends IdDto{
    //@IsUserExist()
    @IsEntityExist(IsUserExistConstraint)
    id: number;
}