import { Stats } from "./stats";
import { Controller } from "./controller"

/**
 * Singleton controller which implements all skills of the skill tree.
 * @author Marvin Kruber
 * @author Sebastian Führ
 */
export class SkillController {

    /** Singleton instance of SkillController */
    private static instance;

    /** Singleton instance which holds game variables */
    private stats: Stats;

    /** Singleton instance of Controller */
    private controller: Controller;                           //TODO Replace with budgetController

    /** Number of currently available skill points */
    private availableSkillPoints: number; 

    /** Purchase price of the next skill point */
    private nextSkillPointPrice: number;

    /** Maximum purchase price for a skill point */
    private maximumSkillPointPrice: number;

    private constructor() {
        this.stats = Stats.getInstance();
        this.controller = Controller.getInstance();

        this.availableSkillPoints = 3; //could be outsourced to stats => see difficulty level
        this.nextSkillPointPrice = 100_000;
        this.maximumSkillPointPrice = 2_000_000;
    }

    // ----------------------------------------------------------------- GENERAL METHODS

    /**
     * Buys skill point and calculates the price 
     * for the next skill point. {@see skillController.ts#updateNextSkillPointPrice}
     * @param sC - SkillController needed for closure {@see menu.ts#buildClosure}
     * @returns false, if the player is not solvent
     */
    public buySkillPoint(sC: SkillController): boolean {
        if(! (sC.stats.budget < sC.nextSkillPointPrice)) return false; //tests if player is solvent

        sC.stats.budget -= sC.nextSkillPointPrice; //buy skill point
        sC.availableSkillPoints++;

        sC.updateNextSkillPointPrice();
    }

    /** Calculates the purchase price for the next skill point. 
     * The maximum price is determined by {@see maximumSkillPointPrice} 
     */
    private updateNextSkillPointPrice(): void {
        this.nextSkillPointPrice = Math.floor(this.nextSkillPointPrice * 1.2);

        if(this.nextSkillPointPrice >= this.maximumSkillPointPrice) this.nextSkillPointPrice = this.maximumSkillPointPrice;
    }

    // ========================================================================================================================= SKILL TREE

    
    // ----------------------------------------------------------------- MEDICAL TREATMENT

    /**
     * The government buys a package of medical supplies, to fill up 
     * the needs of all hospitals and medical staff. (Medical supplies 
     * consist of the most necessary medical equipment like face masks, 
     * gloves, disinfectant, etc.)
     */
    private additionalMedicalSuppliesI = false;

    /**
     * The government declares state of emergency. Large amounts 
     * of money will be spent on additional medical supplies.  
     * Medical staff will be provided with upgraded face masks (FFP3-masks).
     */
    private additionalMedcialSuppliesII = false;

    /**
     * Increase of hygiene standards and additional medical staff 
     * in hospitals and other medical facilities.
     */
    private upgradeMedicalFacilitiesI = false;

    /**
     * Hospitals will be upgraded with modern medical equipment. 
     * (Isolated ventilation systems, ventilators, etc. to enable 
     * isolated treatments in quarantine)
     */
    private upgradeMedicalFacilitiesII = false;

    /**
     * Large investments in all medical facilities. New hospitals built out of nothing. 
     * Large research institutes working together. Medical staff are getting protective 
     * suits with masks and filter attachments.  
     */
    private upgradeMedicalFacilitiesIII = false;

    /**
     * A research Institute discovered the effectiveness of a 
     * medicine which can reduce symptoms.
     */
    private medicineI = false;

    /**
     * A new medicine developed to slow down the speed of 
     * the spreading, in the human body.
     * 
     * (requires “DNA/ RNA Code-Sequence” from [Testing])
     */
    private medicineII = false;

    /**
     * A highly effective medicine got developed, which can stop the 
     * virus from spreading in the human body. If taken early enough 
     * there is a high chance the human will survive
     */
    private medicineIII = false;

    // ----------------------------------------------------------------- POLICE

    /**
     * Police will be informed and educated by experts and are spreading 
     * facts and positive hope messages to citizen by contact. Citizen will 
     * trust the police and feel safer.
     */
    private learnExpertise = false;

    /**
     * Police forces will be provided extra safety equipment in which 
     * they feel safer. This increases the effectiveness of the police. 
     * 
     * (requires “Additional Medical Supplies I” from [Medical Treatments])
     */
    private policeEquipment = false;

    /**
     * Police forces will be provided with test-kits and can test citizen, 
     * which they suspect of illness. 
     */
    private testing = false;

    /**
     * The police are now able to track the people, which might have encountered 
     * with already infected people.
     * 
     * (requires “Nationwide Testing” from [Testing])
     */
    private trackingEncounters = false;

    /**
     * The government deploy military troops in the major cities to provide 
     * security and maintain control. This reduces the chance that citizen 
     * will violate the law and break out of lockdown.
     */
    private militaryI = false;

    /**
     * All military forces are deployed around the whole country to provide 
     * security and maintain control. Any outbreak or violation of the law 
     * will be punished immediately. The military uses transport vehicles 
     * to provide food to the citizens and transport infected people to hospitals.
     */
    private militaryII = false;

    /**
     * All cities are under entry and exit ban. Major roads are blocked by 
     * military forces. The military has the instruction to shoot down any 
     * citizen, who attempts to break out from a lockdown.
     */
    private militaryIII = false;

    // ----------------------------------------------------------------- TESTING

    /**
     * The government use funds and loans to stock up the amount of test-kits. 
     * The overall number of tests per day will increase.
     */
    private additionalTestKits = false;

    /**
     * A research institute developed a new method of testing which is more 
     * reliable than the old tests. 
     */
    private upgradeTestKitI = false;

    /**
     * Testing is now faster and even more reliable.
     */
    private upgradeTestKitII = false;

    /**
     * The government declares to not only test the people with symptoms and 
     * those who had contact to those but allowing nationwide tests.
     */
    private nationwideTesting = false;

    /**
     * A research institute analysed a code-sequence of the (virus). The new 
     * discovery will speed up the research for a cure
     */
    private dnaRnaCodeSequence = false;

    /**
     * A new antibody test now allows fully reliable tests which 
     * can be done in under 2 hours.
     */
    private immunityTests = false;
    
    // ----------------------------------------------------------------- LOCKDOWN

    /** Big events with more than 1000 people are cancelled. 
     * The government suggests washing hands more often and to hold your 
     * hand in front of your mouth when coughing. 
     * Infected people are treated as usual in average hospitals.
     */
    private lockdownStageI = false;

    /** Events and Groups with more than 100 people are forbidden. 
     * Infected people are treated isolated if possible. Citizens are 
     * recommended to stay home and work from home if possible and only 
     * go outside when necessary. Common public facilities beside from 
     * school and churches are closed. Citizens are supervised to avoid 
     * contact to others when going out. 
     */
    private lockdownStageII = false;

    /**
     * All public facilities (schools, churches, universities, etc.) are 
     * closed. Everyone citizens are under curfew. Going to the supermarket 
     * and hospitals is still allowed. No more than two Families are allowed 
     * to meet in one apartment. When going outside people must keep a distance 
     * of 1.5 meters from others.
     */
    private lockdownStageIII = false;

    /**
     * Full lockdown. No one is supposed to be outside of their houses. 
     * Military provide food and water.
     * 
     * (requires “Military II” from [Police])
     */
    private lockdownStageIV = false;


    /**
     * Limited public transportation. Drivers are provided with more safety 
     * so that they can concentrate on their work. Wearing a mask is required 
     * while using public transportation. Vehicles are cleaned and sterilized daily.
     */
    private publicTransport = false;

    /**
     * No public transportation. Roadblocks prevent citizens from using their own car 
     * to drive around. Airports and docks are closed. Only vehicles allowed are those 
     * from the police, the military and high officials.
     */
    private restrictedTraffic = false;

    /**
     * The government honors the work of important jobs (health workers, doctors and 
     * even supermarket cashiers) with a lot of applause and shoutouts. After a lot of 
     * complaints and negative critique from the internet and influencers the government 
     * is pressurized to raise the wage of those people a bit. 
     */
    private financialSupportI = false;

    /**
     * To assure citizens will stay home and to prevent people from going bankrupt the 
     * generous government will provide a monthly financial support packet to those who 
     * are directly affected by the lockdown.
     */
    private financialSupportII = false;

    // ----------------------------------------------------------------- CITIZENS

    /**
     * Officials are holding press conferences to make statements about the current 
     * situation. Specialists are recommending behaviours (hand washing, not touching 
     * faces, etc.). Citizens feel more enlightened and the government seems 
     * transparent and trustworthy.
     */
    private expertiseI = false;

    /**
     * Officials working together with experts and influencers to help provide positive 
     * messages and helpful behaviour. This will reduce the spread of made up fake news.
     * Citizens are more likely to adapt recommended behaviours. (washing hands more frequently, 
     * coughing into elbow, not touching faces, distance from other people, etc.)
     */
    private expertiseII = false;

    /**
     * Everyone strictly follows recommended behaviours. (excessive hand washing, very high 
     * usage of disinfectant everywhere, no handshaking when greeting others, etc.)
     * Citizens now wear face masks to protect others of getting infected.
     * 
     * (requires “Additional Medical Supplies I” from [Medical Treatments])
     */
    private expertiseIII = false;

    /** The use of a tracking app based on voluntary basis is now available for citizens to use. */
    private trackingAppI = false;

    /**
     * The government overtake the Tracking app. Every citizen must use the tracking app to enable 
     * localization and to help informing the police and other citizens about infected people.
     * 
     * (requires “ Tracking Encounters” from [Police])
     */
    private trackingAppII = false;

    // ========================================================================================================================= GETTER-METHODS

    /** @returns The singleton instance */
    public static getInstance(): SkillController {
        if (!SkillController.instance) SkillController.instance = new SkillController();
            return SkillController.instance;
        }

    /** @returns Number of currently available skill points */
    public getAvailableSkillPoints(): number {return this.availableSkillPoints}

    /** @returns Purchase price of the next skill point */
    public getNextSkillPointPrice(): number {return this.nextSkillPointPrice}

}