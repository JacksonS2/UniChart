export interface IDatabase {
    wings: {
        [key: string]: {
            name: string,
            staff: IMember[],
            groups: {
                [key: string]: {
                    name: string,
                    staff: IMember[],
                    squadrons: {
                        [key: string]: {
                            name: string,
                            staff: IMember[],
                            flights: {
                                [key: string]:{
                                    name: string,
                                    staff: IMember[],
                                    members: IMember[]
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}


export interface IMember {
    grade: "" | "C/1st Class" | "C/2nd Class" | "C/3rd Class" | "C/4th Class" | "C/2nd Lt" | "C/1st Lt" | "C/Cpt" | "C/Maj" | "C/LtCol" | "C/Col",
    lastName: string,
    firstName: string,
    email: string,
    biography: string,
    dutyTitle: string,
    profilePictureURL: string,
    unitDesignation: string,
}