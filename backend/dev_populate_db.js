/// Populate databse with dummy data

const { db } = require("./shared/database")

// use npm run dev_populate_db

async function main() {

    // Configured locations
    await db.collection('buildings').doc('super_company_001').set({
        groups: {
            "a4b23df1": {
                title: "Main Hall",
            },
            "c3b21dd9": {
                title: "Stairs",
            },
            "33fa1dd1": {
                title: "Common Room",
            },
        },
        title: "Super Company Inc. Headquarters",
        pin: "12345678"
    })

    // Physical devices (dummy, of course)
    await db.collection('physical_devices').doc('2ajae23d').set({
        belongs: "super_company_001",
        switches: {
            A: {
                group: "a4b23df1",
                name: "Light 1",
                physical: 'A',
                state: true
            },
            B: {
                group: "a4b23df1",
                name: "Light 2",
                physical: 'B',
                state: true
            },
            C: {
                group: "a4b23df1",
                name: "Hidden switch",
                physical: 'C',
                state: false
            }
        }
    })

    await db.collection('physical_devices').doc('2431dfa2').set({
        belongs: "super_company_001",
        switches: {
            A: {
                group: "c3b21dd9",
                name: "All",
                physical: 'A',
                state: true
            },
            B: {
                group: "33fa1dd1",
                name: "Main",
                physical: 'B',
                state: true
            },
            C: {
                group: "33fa1dd1",
                name: "Secondary",
                physical: 'C',
                state: false
            }
        }

    })

    process.exit()
}

main()