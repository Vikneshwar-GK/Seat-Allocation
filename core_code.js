const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const uri = "mongodb+srv://Viky_Gk:qwerty12345@cluster0-xobzj.mongodb.net/test?retryWrites=true&w=majority";
const mongoose = require('mongoose');
const User = require('./models/stud_info');
//app.use("view engine", "ejs");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));


function mongo_connect() {
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log("Mongodb connected")).catch((err) => console.log(err));
}

function blockdist(blockroom, room_matrix, stud_seat, br_seat_list, seat_type) {

    var seat_list = []
    if (stud_seat[blockroom] == undefined) {
        stud_seat[blockroom] = {};
    }

    //room_matrix = block_obj[blockroom];
    var num = 0;
    var rem = 0;
    //var table_count = 0;
    while (room_matrix != 0) {

        rem = room_matrix % 10;
        // table_count += rem;
        num = (num * 10) + rem;
        room_matrix = Math.floor(room_matrix / 10);
    }
    room_matrix = num;
    var col_count = 1;
    var seat_no = 0;

    while (room_matrix != 0) {
        row_count = room_matrix % 10;
        //console.log("seat");
        while (row_count > 0) {
            if (seat_type == 2) {
                seat_no = ((col_count * 10) + row_count) * 10;
                stud_seat[blockroom][seat_no] = undefined;
                seat_list.push(blockroom + "-" + seat_no);


                seat_no = (((col_count * 10) + row_count) * 10) + 1;
                stud_seat[blockroom][seat_no] = undefined;
                seat_list.push(blockroom + "-" + seat_no);
            } else if (seat_type == 1) {
                seat_no = ((col_count * 10) + row_count);
                stud_seat[blockroom][seat_no] = undefined;
                seat_list.push(blockroom + "-" + seat_no);
            }
            row_count = row_count - 1;
        }
        col_count = col_count + 1;
        room_matrix = Math.floor(room_matrix / 10);
    }
    seat_list.sort();
    br_seat_list = br_seat_list.concat(seat_list);
    return (br_seat_list);
}

function blockroom_process(block_obj, blockroom_list) {
    for (var i in block_obj) {
        blockroom_list.push(i);
    }
}

function dept_score(subj1, subj2) {
    if (subj1 == subj2) {
        return (0);
    } else {
        return (1);
    }

}

function randomNumber(max) {
    return Math.floor(Math.random() * max);
}

function dept_arrange(time_table, dept_pref, dept_matrix, dept_list) {


    for (var i = 0; i < dept_list.length; i++) {
        if (dept_matrix[dept_list[i]] == undefined) {
            dept_matrix[dept_list[i]] = [];
        }
        for (var j = 0; j < dept_list.length; j++) {
            if (i != j) {
                var score = dept_score(time_table[dept_list[i]], time_table[dept_list[j]]);
                if (score == 0) {
                    if (!(dept_pref.includes(dept_list[j]))) {
                        dept_pref.push(dept_list[j]);
                    }
                }
                if (score != 0) {
                    dept_matrix[dept_list[i]].push(dept_list[j]);
                }
            }
        }
    }

}

function dept_stud_dist(dept_stud, result, seat_plan) {
    //console.log(result);
    for (var i = 0; i < result.length; i++) {
        if (dept_stud[result[i].dept] == undefined) {
            dept_stud[result[i].dept] = [];
        }
        dept_stud[result[i].dept].push(result[i].roll);
    }

    for (var val in dept_stud) {
        seat_plan[val] = {};
        dept_stud[val].sort();
    }
}

function dept_remover_index(rm_list, index) {
    dept = rm_list.splice(index, 1);
    return (dept[0]);
}

function dept_remover_value(rm_list, dept) {
    var index = rm_list.indexOf(dept);
    rm_list.splice(index, 1);
    return index;
}

function dept_remover_matrix(matrix, dept) {
    for (var i in matrix) {
        if (matrix[i].indexOf(dept) > -1) {
            matrix[i].splice(matrix[i].indexOf(dept), 1);
        }
    }
}

function randomNumber(max) {
    return Math.floor(Math.random() * max);
}

function dept_selector(dept, dept_list, dept_pref, dept_matrix, seat_type, shift_signal) {
    for (var i = 0; i < dept_pref.length; i++) {
        var a = dept_pref[i];
        if (dept_matrix[dept].includes(a)) {
            dept_remover_index(dept_pref, i);
            dept_remover_value(dept_list, a);
            dept_remover_matrix(dept_matrix, a);
            return (a);
        }
    }
    if (dept_matrix[dept].length > 0) {
        var rand = randomNumber(dept_matrix[dept].length);
        var dep = dept_matrix[dept][rand];
        dept_remover_value(dept_list, dep);
        dept_remover_matrix(dept_matrix, dep);

    } else {
        var rand = randomNumber(dept_list.length);
        var dep = dept_list[rand];
        dept_remover_index(dept_list, rand);
        dept_remover_matrix(dept_matrix, dep);
        if (seat_type == 2) {
            shift_signal[0] = 1;
        }
    }
    return dep;
}

function bit_initialize(del_this, dept_list, dept_pref, dept_matrix, enque_dept, bit, seat_type, shift_signal) {
    bit = (bit + 1) % 2;
    var dept = enque_dept[bit];
    bit = (bit + 1) % 2;
    enque_dept[bit] = dept_selector(dept, dept_list, dept_pref, dept_matrix, seat_type, shift_signal);
    del_this.push(enque_dept[bit]);
}

function dept_select_initial(del_this, dept_list, dept_pref, dept_matrix, enque_dept, dept_plan_que, enque_dept_old, shift_signal, seat_type, one_dept_signal) {
    var dept;
    if (dept_list.length == 1) {
        enque_dept.push(dept_list[0]);
        //enque_dept.push(dept_list[0]);
        one_dept_signal[0] = 1;

        if (seat_type == 2) {
            shift_signal[0] = 1;
        }

        del_this.push(dept_list[0]);

        dept_plan_que.push(dept_list[0]);
        enque_dept_old.push(dept_list[0]);
        dept = dept_remover_index(dept_list, 0);
        dept_remover_value(dept_pref, dept);
        dept_remover_matrix(dept_matrix, dept);
        return 0;
    } else if (dept_pref.length > 0) {
        var random_num = randomNumber(dept_pref.length);
        dept = dept_remover_index(dept_pref, random_num);
        dept_remover_value(dept_list, dept);
        dept_remover_matrix(dept_matrix, dept);
    } else {
        var random_num = randomNumber(dept_list.length);
        dept = dept_remover_index(dept_list, random_num);
        dept_remover_matrix(dept_matrix, dept);
    }
    enque_dept.push(dept);
    dept_plan_que.push(dept);
    enque_dept_old.push(dept);

    del_this.push(dept);

    dept = dept_selector(dept, dept_list, dept_pref, dept_matrix, seat_type, shift_signal);

    del_this.push(dept);

    enque_dept.push(dept);
    dept_plan_que.push(dept);
    enque_dept_old.push(dept);
}

function seat_plan_room(seat_plan, seat_plan_ec) {
    for (let i in seat_plan) {
        for (let j in seat_plan[i]) {
            if (seat_plan_ec[j] == undefined) {
                seat_plan_ec[j] = {};
            }
            if (seat_plan_ec[j][i] == undefined) {
                seat_plan_ec[j][i] = {}
                    //seat_plan_ec[j]['TOTAL'] = 0;
            }
            Object.assign(seat_plan_ec[j][i], seat_plan[i][j]);
            //seat_plan_ec[j]['TOTAL'] = seat_plan_ec[j]['TOTAL'] + seat_plan[i][j]['total'];
        }
    }

}

function write_to_db(seat_plan, sp_db) {


    var sql = "insert into seatplan (dept, roomno, rollno, total) values ?";
    //var sp_db = [];
    var val;
    for (var dept in seat_plan) {
        for (var room in seat_plan[dept]) {
            val = [];
            val.push(dept.toString());
            val.push(room.toString());
            var start = seat_plan[dept][room]['start'];
            var end = seat_plan[dept][room]['end'];
            var rollno = "";
            for (var roll = 0; roll < start.length; roll++) {

                if (start[roll] != end[roll]) {
                    rollno += start[roll] + "-" + end[roll] + ",";
                } else {
                    rollno += end[roll] + ",";
                }

            }
            rollno = rollno.slice(0, rollno.length - 1);
            val.push(rollno.toString());
            val.push(seat_plan[dept][room]['total'].toString());
            //val.push(seat_plan[dept][room]['total']);
            sp_db.push(val);

        }
    }
    //console.log(sp_db);
    // con.query(sql, [sp_db], function(err, result) {
    //     if (err) throw err;
    //     console.log("Number of records inserted: " + result.affectedRows);
    // });


}

function core_operation(req, res) {
    var year = 2;
    var block_obj = {

        'A101': 4567,
        'A102': 5476,
        'A103': 4587,
        'A105': 8788,

        'B101': 5478,
        'B102': 7545,
        'B103': 6875,
        'B104': 9874,
        'B105': 7845,
        'B201': 7847,

        'C101': 5478,
        'C102': 7545,
        'C103': 6875,
        'C104': 9874,
        'C105': 7845,
        'C201': 7847,

        'D101': 5478,
        'D102': 7545,
        'D103': 6875,
        'D104': 9874,
        'D105': 7845,
        'D201': 7847,

        'E101': 5478,
        'E102': 7545,
        'E103': 6875,
        'E104': 9874,
        'E105': 7845,
        'E201': 7847,

        'F101': 5478,
        'F102': 7545,
        'F103': 6875,
        'F104': 9874,
        'F105': 7845,
        'F201': 7847,

        'G101': 5478,
        'G102': 7545,
        'G103': 6875,
        'G104': 9874,
        'G105': 7845,
        'G201': 7847

        // 'H101': 5478,
        // 'H102': 7545,
        // 'H103': 6875,
        // 'H104': 9874,
        // 'H105': 7845,
        // 'H201': 7847,

        // 'Q101': 5478,
        // 'Q102': 7545,
        // 'Q103': 6875,
        // 'Q104': 9874,
        // 'Q105': 7845,
        // 'Q201': 7847
    }
    var dept_list = ['IT', 'CSE', 'FOODTECH', 'BIOTECH', 'AERO'];
    var seat_type = 2;
    var time_table = {
        'CSE': 'cs17401',
        'BIOTECH': 'bt17401',
        // 'ECE': 'ec17401',
        // 'EEE': 'ee17401',
        'IT': 'cs17401',
        // 'MECH': 'me17401',
        'FOODTECH': 'ft17401',
        'AERO': 'ar17401'
    };
//**********************************************************************************/
    var stud_seat = {};
    var blockroom_list = [];
    var br_seat_list = [];
    var room_no;
    var seat_no;


    var bit = 1;
    var dept_stud = {};
    var dept_pref = [];
    var dept_matrix = [];
    var enque_dept = [];
    var shift_signal = [0];
    var one_dept_signal = [0];

    var sp_db = [];
    var sp_rm = [];
    var seat_plan = {};
    var seat_plan_ec = {};
    var bit_plan = [0, 0];
    var hold = [0, 0];
    var dept_plan_que = [];
    var room_plan_que = [];
    var enque_dept_old = [];
    var block_room_old;
    var signal = 0;
    var total = [0, 0];
    var del_this = [];
    var need_room = 0;

    blockroom_process(block_obj, blockroom_list);

    dept_arrange(time_table, dept_pref, dept_matrix, dept_list);

    mongo_connect();

    User.find({ dept: { "$in": dept_list }, year: year }, (err, result) => {


        if (err) {
            return console.error('error : ' + err.message);
        } else {

            //console.log(result);




            dept_stud_dist(dept_stud, result, seat_plan);
            // console.log(dept_stud);
            //console.log(result);
            // for (var i in dept_stud) {
            //     console.log(i, dept_stud[i]);
            // }



            dept_select_initial(del_this, dept_list, dept_pref, dept_matrix, enque_dept, dept_plan_que, enque_dept_old, shift_signal, seat_type, one_dept_signal);
            // console.log("dept_list", dept_list);
            // console.log("dept_pref", dept_pref);
            // console.log("dept_matrix", dept_matrix);
            // console.log("enqued", enque_dept);
            roomno = blockroom_list.shift();
            br_seat_list = blockdist(roomno, block_obj[roomno], stud_seat, br_seat_list, seat_type);

            //console.log(stud_seat);
            // console.log("blockroom", blockroom_list);
            //console.log(br_seat_list);
            var room_seat;
            //console.log("deptstud", dept_stud);
            //console.log(stud_seat);
            //console.log(room_no, " -- ", seat_no);
            // console.log(result.length);
            // console.log(result.length);
            // console.log(dept_stud['it2'].length + dept_stud['foodtech2'].length);
            //console.log(result.length);

            for (var i = 0; i < result.length; i++) {
                // console.log(i);
                // if (i == 1890) {
                //     console.log(blockroom_list);
                //     console.log(br_seat_list);
                // }


                //  console.log(i);
                bit = (bit + 1) % 2;
                if (one_dept_signal[0] == 1 && bit == 1) {
                    bit = 0;
                }


                if (br_seat_list.length <= 3) {
                    if (blockroom_list.length == 0) {
                        need_room = 1;
                        break;
                    } else {

                        roomno = blockroom_list.shift();
                        br_seat_list = blockdist(roomno, block_obj[roomno], stud_seat, br_seat_list, seat_type);
                    }
                }
                if (dept_stud[enque_dept[bit]].length == 0 && dept_list.length > 0) {
                    bit_initialize(del_this, dept_list, dept_pref, dept_matrix, enque_dept, bit, seat_type, shift_signal);

                }
                if (dept_stud[enque_dept[bit]].length == 0 && dept_list.length == 0) {
                    //console.log("das");
                    shift_signal[0] = 0;
                    if (signal == 0) {
                        signal = 1;
                        seat_plan[enque_dept_old[bit]][block_room_old]['end'].push(hold[bit] + bit_plan[bit] - 1);
                        dept_plan_que.push(enque_dept[bit]);
                        seat_plan[enque_dept_old[bit]][block_room_old]['total'] = total[bit];
                        hold[bit] = 0;
                        total[bit] = 0;
                    }
                    if (seat_type == 1) {

                        bit = (bit + 1) % 2;
                        //enque_dept[bit] = enque_dept[(bit + 1) % 2];
                    }
                    if (seat_type == 2) {
                        //enque_dept[bit] = enque_dept[(bit + 1) % 2];
                        //console.log("de");

                        bit = (bit + 1) % 2;
                        br_seat_list.shift();

                    }
                }


                //console.log(room_seat);
                if (shift_signal[0] == 1) {
                    br_seat_list.shift();
                }



                room_seat = br_seat_list.shift();
                room_no = room_seat.substring(0, room_seat.indexOf('-'));
                seat_no = room_seat.substring(room_seat.indexOf('-') + 1);

                if (room_plan_que.length == 0) {
                    room_plan_que.push(room_no);
                }
                if (seat_plan[enque_dept[bit]] == undefined) {
                    seat_plan[enque_dept[bit]] = {}
                }
                if (seat_plan[enque_dept[bit]][room_no] == undefined) {
                    seat_plan[enque_dept[bit]][room_no] = {
                        'start': [],
                        'end': [],
                        'total': undefined
                    }
                }


                var roll_no = dept_stud[enque_dept[bit]].shift();
                //console.log(i, " = ", roll_no);
                if (!(dept_plan_que.includes(enque_dept[bit]))) {
                    seat_plan[enque_dept_old[bit]][block_room_old]['end'].push(hold[bit] + bit_plan[bit] - 1);
                    dept_plan_que.push(enque_dept[bit]);
                    seat_plan[enque_dept_old[bit]][block_room_old]['total'] = total[bit];
                    hold[bit] = 0;
                    total[bit] = 0;

                } else if (!(room_plan_que.includes(room_no))) {
                    if (signal == 0) {
                        if (one_dept_signal[0] == 1) {
                            seat_plan[enque_dept_old[0]][block_room_old]['end'].push(hold[0] + bit_plan[0] - 1);
                            //seat_plan[enque_dept_old[1]][block_room_old]['end'].push(hold[1] + bit_plan[1] - 1);
                            room_plan_que.push(room_no);
                            seat_plan[enque_dept_old[0]][block_room_old]['total'] = total[0];
                            //seat_plan[enque_dept_old[1]][block_room_old]['total'] = total[1];
                            hold[0] = 0;
                            //hold[1] = 0;
                            total[0] = 0;
                            //total[1] = 0;
                        } else {
                            seat_plan[enque_dept_old[0]][block_room_old]['end'].push(hold[0] + bit_plan[0] - 1);
                            seat_plan[enque_dept_old[1]][block_room_old]['end'].push(hold[1] + bit_plan[1] - 1);
                            room_plan_que.push(room_no);
                            seat_plan[enque_dept_old[0]][block_room_old]['total'] = total[0];
                            seat_plan[enque_dept_old[1]][block_room_old]['total'] = total[1];
                            hold[0] = 0;
                            hold[1] = 0;
                            total[0] = 0;
                            total[1] = 0;
                        }
                    } else {
                        seat_plan[enque_dept_old[bit]][block_room_old]['end'].push(hold[bit] + bit_plan[bit] - 1);
                        room_plan_que.push(room_no);
                        seat_plan[enque_dept_old[bit]][block_room_old]['total'] = total[bit];
                        hold[bit] = 0;
                        total[bit] = 0;
                    }
                }

                total[bit]++;
                if (hold[bit] == 0) {
                    hold[bit] = roll_no;
                    bit_plan[bit] = 1;
                    seat_plan[enque_dept[bit]][room_no]['start'].push(hold[bit]);
                } else if (roll_no - hold[bit] == bit_plan[bit]) {
                    bit_plan[bit]++;

                } else if (roll_no - hold[bit] != bit_plan[bit]) {
                    seat_plan[enque_dept[bit]][room_no]['end'].push(hold[bit] + bit_plan[bit] - 1);
                    seat_plan[enque_dept[bit]][room_no]['start'].push(roll_no);
                    bit_plan[bit] = 1;
                    hold[bit] = roll_no;
                }

                enque_dept_old[bit] = enque_dept[bit];
                block_room_old = room_no;

                if (i == result.length - 1) {
                    seat_plan[enque_dept_old[bit]][block_room_old]['end'].push(hold[bit] + bit_plan[bit] - 1);
                    seat_plan[enque_dept_old[bit]][block_room_old]['total'] = total[bit];
                }

                stud_seat[room_no][seat_no] = roll_no;


                //console.log(i);
                // if (i == result.length - 1) {
                //     console.log(stud_seat);
                // }
                //console.log("helo");
            }
            // console.log("helo");
            if (need_room == 1) {
                console.log("Need More Rooms!!!");
                return (0);
            }
            seat_plan_room(seat_plan, seat_plan_ec);
            write_to_db(seat_plan, sp_db);
            write_to_db(seat_plan_ec, sp_rm);

            console.log("done");
            res.render("auto-table", { obj1: sp_db, obj2: sp_rm });

        }

    });
}

app.get("/", (req, res) => {
    core_operation(req, res);
});

app.post("/", (req, res) => {
    res.send("downloaded");
});


app.listen(3000, () => {
    console.log("Server started on port 3000");
});