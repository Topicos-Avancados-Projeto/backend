import { IsNotEmpty, IsObject, IsString, IsUUID } from "class-validator"
import { UUID } from "crypto"

export class DevicePost{
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    description: string

    @IsUUID()
    group: UUID

    @IsUUID()
    topics: UUID

    @IsUUID()
    type: UUID
}