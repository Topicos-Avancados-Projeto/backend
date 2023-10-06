import { ResourceOwnershipChecker } from "../interfaces/resource.ownership.checker";

export class UserOwnershipChecker implements ResourceOwnershipChecker<string, string>{
    public checkOwnership(resourceId: string, userId: string): boolean {
        return resourceId == userId;
    }

}