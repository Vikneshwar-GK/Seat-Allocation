var con;
var mysql;

// CONNECTION STATEMENT
//****************************************************************** */
function mysqlconnect() {
    mysql = require('mysql');
    con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "xiic12339",
        database: "examseatallocation"
    });
    con.connect(function(err) {
        if (err) {
            return console.error('error : ' + err.message);
        }
    });
}



function queryprocess(seat_type) {
    //con.query("select blockid,roomno,matrix from blockdetails", function(err, result) {
        // if (err) {
        //     return console.error('error : ' + err.message);
        // } else {
            
            var seat = {};
            var block_name = [];
            var blockname;
            var table_count = 0;
            
            for (var i = 0; i < result.length; i++) {

                blockname = result[i].blockid;

                if (!(block_name.includes(blockname))) {
                    block_name.push(blockname);
                    seat[blockname] = {};
                    
                }

                var room_no = result[i].roomno;

                seat[blockname][room_no] = {};
                var room_matrix = result[i].matrix;

                var num = 0;
                var rem = 0;
                //var table_count = 0;
                while (room_matrix != 0) {

                    rem = room_matrix % 10;
                    table_count += rem;
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
                            seat[blockname][room_no][seat_no] = undefined;

                            seat_no = (((col_count * 10) + row_count) * 10) + 1;
                            seat[blockname][room_no][seat_no] = undefined;
                        } else if (seat_type == 1) {
                            seat_no = ((col_count * 10) + row_count);
                            seat[blockname][room_no][seat_no] = undefined;
                        }
                        row_count = row_count - 1;
                    }
                    col_count = col_count + 1;
                    room_matrix = Math.floor(room_matrix / 10);
                }
            }
            //console.log(seat);
            seat_allotment(seat, table_count, seat_type);
      //  }
    //});
}

function seat_allotment(seat, table_count, seat_type) {
    //console.log(seat);
    var year = '2';
    var stud = {};
    var temp_dept = [];
    var block_que = ['A', 'B', 'F', 'M'];
    var room_que = [];
    var seat_que = [];
    var block_temp;
    var room_temp;
    var seat_temp;
    var enque_dept = [];
    var bit = 1;
    var exam_dept_subj = {
        'cse2': 'cs17401',
        'biotech2': 'bt17401',
        'ece2': 'ec17401',
        'eee2': 'ee17401',
        'it2': 'cs17401',
        'mech2': 'me17401',
        'foodtech2': 'ft17041'
    };
    var dept_matrix = {};
    var pref_que = [];
    var del_this = [];
    var seat_plan = {};
    var bit_plan = [0, 0];
    var hold = [0, 0];
    var dept_plan_que = [];
    var room_plan_que = [];
    var enque_dept_old = [];
    var block_room_old;
    var signal = 0;
    var total = [0, 0];

    con.query("select deptid,rollno from deptstuddetails where deptid in ('cse2','it2' ) and deptid like '%2'", function(err, result) {
        if (err) {
            return console.error('error : ' + err.message);
        } else {
            //console.log(seat);
            for (var i = 0; i < result.length; i++) {
                if (!(temp_dept.includes(result[i].deptid))) {
                    temp_dept.push(result[i].deptid);
                    stud[result[i].deptid] = [];
                }
                stud[result[i].deptid].push(result[i].rollno);
            }

            if (seat_type * table_count < result.length) {
                console.log("Insufficient space");
                return;
            }

            for (var val = 0; val < temp_dept.length; val++) {
                seat_plan[temp_dept[val]] = {};
                stud[temp_dept[val]].sort();
            }

            for (var i = 0; i < temp_dept.length; i++) {
                if (dept_matrix[temp_dept[i]] == undefined) {
                    dept_matrix[temp_dept[i]] = [];
                }
                for (var j = 0; j < temp_dept.length; j++) {
                    if (i != j) {
                        var score = dept_score(exam_dept_subj[temp_dept[i]], exam_dept_subj[temp_dept[j]]);
                        if (score == 0) {
                            if (!(pref_que.includes(temp_dept[j]))) {
                                pref_que.push(temp_dept[j]);
                            }
                        }
                        if (score != 0) {
                            dept_matrix[temp_dept[i]].push(temp_dept[j]);
                        }
                    }
                }
            }

            var rand;
            var dept;
            if (pref_que.length > 0) {
                rand = randomNumber(pref_que.length);
                dept = pref_que.splice(rand, 1);
                dept = dept[0];
                temp_dept.splice(temp_dept.indexOf(dept), 1);

                for (var i in dept_matrix) {
                    if (dept_matrix[i].indexOf(dept) > -1) {
                        dept_matrix[i].splice(dept_matrix[i].indexOf(dept), 1);
                    }
                }
            } else {
                rand = randomNumber(temp_dept.length);
                dept = temp_dept.splice(rand, 1);
                dept = dept[0];
                for (var i in dept_matrix) {
                    if (dept_matrix[i].indexOf(dept) > -1) {
                        dept_matrix[i].splice(dept_matrix[i].indexOf(dept), 1);
                    }
                }
            }
            enque_dept.push(dept);
            del_this.push(dept);
            dept_plan_que.push(dept);
            enque_dept_old.push(dept);
            dept = dept_selector(dept, pref_que, temp_dept, dept_matrix);
            del_this.push(dept);
            enque_dept.push(dept);
            enque_dept_old.push(dept);
            dept_plan_que.push(dept);

            for (var i = 0; i < result.length; i++) {

                function seating() {
                    if (seat_que.length == 0) {
                        if (room_que.length == 0) {
                            if (block_que.length == 0) {
                                console.log("Insuffient space");
                            } else {
                                block_temp = block_que.shift();
                                for (var val in seat[block_temp]) {
                                    room_que.push(val);
                                }
                                room_que.sort();
                                room_temp = room_que.shift();
                                for (var val in seat[block_temp][room_temp]) {
                                    seat_que.push(val);
                                }
                                seat_que.sort();

                            }
                        } else {
                            room_temp = room_que.shift();
                            for (var val in seat[block_temp][room_temp]) {
                                seat_que.push(val);
                            }
                            seat_que.sort();
                            // console.log('seat', seat_que);
                        }
                    }
                }
                seating();
                if (room_plan_que.length == 0) {
                    room_plan_que.push(block_temp + room_temp);
                }
                seat_temp = seat_que.shift();
                bit = (bit + 1) % 2;
                if (seat_type == 2) {
                    if (stud[enque_dept[bit]].length == 0 && temp_dept.length > 0) {
                        bit_initializer(pref_que, temp_dept, dept_matrix, enque_dept, bit, del_this, seat_type);

                    } else if (stud[enque_dept[bit]].length == 0 && temp_dept.length == 0) {
                        if (signal == 0) {
                            signal = 1;
                            seat_plan[enque_dept_old[bit]][block_room_old]['end'].push(hold[bit] + bit_plan[bit] - 1);
                            dept_plan_que.push(enque_dept[bit]);
                            seat_plan[enque_dept_old[bit]][block_room_old]['total'] = total[bit];
                            hold[bit] = 0;
                            total[bit] = 0;
                        }
                        if (seat_que.length == 0) {
                            seating();
                            bit = (bit + 1) % 2;
                            seat_temp = seat_que.shift();
                        } else {
                            bit = (bit + 1) % 2;
                            seat_temp = seat_que.shift();
                        }
                    }
                } else if (seat_type == 1) {
                    if (stud[enque_dept[bit]].length == 0 && temp_dept.length > 0) {
                        bit_initializer(pref_que, temp_dept, dept_matrix, enque_dept, bit, del_this, seat_type);

                    } else if (stud[enque_dept[bit]].length == 0 && temp_dept.length == 0) {
                        if (signal == 0) {
                            signal = 1;
                            seat_plan[enque_dept_old[bit]][block_room_old]['end'].push(hold[bit] + bit_plan[bit] - 1);
                            dept_plan_que.push(enque_dept[bit]);
                            seat_plan[enque_dept_old[bit]][block_room_old]['total'] = total[bit];
                            hold[bit] = 0;
                            total[bit] = 0;
                        }
                        bit = (bit + 1) % 2;
                    }
                }

                if (seat_plan[enque_dept[bit]] == undefined) {
                    seat_plan[enque_dept[bit]] = {}
                }
                if (seat_plan[enque_dept[bit]][block_temp + room_temp] == undefined) {
                    seat_plan[enque_dept[bit]][block_temp + room_temp] = {
                        'start': [],
                        'end': [],
                        'total': undefined
                    }
                }
                var stud_roll = stud[enque_dept[bit]].shift();

                if (!(dept_plan_que.includes(enque_dept[bit]))) {
                    seat_plan[enque_dept_old[bit]][block_room_old]['end'].push(hold[bit] + bit_plan[bit] - 1);
                    dept_plan_que.push(enque_dept[bit]);
                    seat_plan[enque_dept_old[bit]][block_room_old]['total'] = total[bit];
                    hold[bit] = 0;
                    total[bit] = 0;

                } else if (!(room_plan_que.includes(block_temp + room_temp))) {
                    if (signal == 0) {
                        seat_plan[enque_dept_old[0]][block_room_old]['end'].push(hold[0] + bit_plan[0] - 1);
                        seat_plan[enque_dept_old[1]][block_room_old]['end'].push(hold[1] + bit_plan[1] - 1);
                        room_plan_que.push(block_temp + room_temp);
                        seat_plan[enque_dept_old[0]][block_room_old]['total'] = total[0];
                        seat_plan[enque_dept_old[1]][block_room_old]['total'] = total[1];
                        hold[0] = 0;
                        hold[1] = 0;
                        total[0] = 0;
                        total[1] = 0;
                    } else {
                        seat_plan[enque_dept_old[bit]][block_room_old]['end'].push(hold[bit] + bit_plan[bit] - 1);
                        room_plan_que.push(block_temp + room_temp);
                        seat_plan[enque_dept_old[bit]][block_room_old]['total'] = total[bit];
                        hold[bit] = 0;
                        total[bit] = 0;
                    }
                }

                total[bit]++;
                if (hold[bit] == 0) {
                    hold[bit] = stud_roll;
                    bit_plan[bit] = 1;
                    seat_plan[enque_dept[bit]][block_temp + room_temp]['start'].push(hold[bit]);
                } else if (stud_roll - hold[bit] == bit_plan[bit]) {
                    bit_plan[bit]++;

                } else if (stud_roll - hold[bit] != bit_plan[bit]) {
                    seat_plan[enque_dept[bit]][block_temp + room_temp]['end'].push(hold[bit] + bit_plan[bit] - 1);
                    seat_plan[enque_dept[bit]][block_temp + room_temp]['start'].push(stud_roll);
                    bit_plan[bit] = 1;
                    hold[bit] = stud_roll;
                }

                enque_dept_old[bit] = enque_dept[bit];
                block_room_old = block_temp + room_temp;

                if (i == result.length - 1) {
                    seat_plan[enque_dept_old[bit]][block_room_old]['end'].push(hold[bit] + bit_plan[bit] - 1);
                    seat_plan[enque_dept_old[bit]][block_room_old]['total'] = total[bit];
                }
                seat[block_temp][room_temp][seat_temp] = stud_roll;
            }
            console.log(del_this);
            // console.log('biotech2', seat_plan['biotech2']);
            // console.log('mech2', seat_plan['mech2']);
            //console.log('foodtech2', seat_plan['foodtech2']);
            // console.log('ece2', seat_plan['ece2']);
            // console.log('it2', seat_plan['it2']);
            // console.log('cse2', seat_plan['cse2']);
            // console.log('eee2', seat_plan['eee2']);
            console.log('A', seat['A']);
            console.log(seat['B']);
            console.log(seat['F'][101])
                //console.log(seat['M'][101]);
        }
    });
}

function bit_initializer(pref_que, temp_dept, dept_matrix, enque_dept, bit, del_this, seat_type) {
    bit = (bit + 1) % 2;
    var dept = enque_dept[bit];
    bit = (bit + 1) % 2;
    dept = dept_selector(dept, pref_que, temp_dept, dept_matrix, seat_type)
    enque_dept[bit] = dept;
    del_this.push(dept);
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

function dept_selector(dept, pref_que, temp_dept, dept_matrix, seat_type) {
    for (var i = 0; i < pref_que.length; i++) {
        var a = pref_que[i];
        if (dept_matrix[dept].includes(a)) {
            pref_que.splice(i, 1);
            temp_dept.splice(temp_dept.indexOf(a), 1);
            for (var j in dept_matrix) {
                if (dept_matrix[j].indexOf(a) > -1) {
                    dept_matrix[j].splice(dept_matrix[j].indexOf(a), 1);
                }
            }
            return (a);
        }
    }

    if (dept_matrix[dept].length != 0) {
        var rand = randomNumber(dept_matrix[dept].length);
        var dep = dept_matrix[dept][rand];
        temp_dept.splice(temp_dept.indexOf(dep), 1);
        for (var i in dept_matrix) {
            if (dept_matrix[i].indexOf(dep) > -1) {
                dept_matrix[i].splice(dept_matrix[i].indexOf(dep), 1);
            }
        }
        return dep;
    } else {
        var rand = randomNumber(temp_dept.length);
        var dep = temp_dept[rand];
        temp_dept.splice(temp_dept.indexOf(dep), 1);
        for (var i in dept_matrix) {
            if (dept_matrix[i].indexOf(dep) > -1) {
                dept_matrix[i].splice(dept_matrix[i].indexOf(dep), 1);
            }
        }
        // if (seat_type == 2) {
        //     seat_type = 1;
        // }
        return dep;

    }
}

function main() {
    mysqlconnect();
    queryprocess(2);
}
main();