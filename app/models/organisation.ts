class Role {
    code: string;
    description: string;
    operationalStartDate: string;
    operationalEndDate: string;
    legalStartDate: string;
    legalEndDate: string;
    status: string;
    primaryRole: boolean;    
}

export class Address {
    addressLines: string[];
    town: string;
    county: string;
    postalCode: string;
    country: string;
}

export class Organisation { 
    name: string;
    addresses: Address[];
    status: string;
    last_changed: string;
    operationalStartDate: string;
    operationalEndDate: string;
    odsCode: string;
    legalStartDate: string;
    legalEndDate: string;
    roles: Role[];    
}