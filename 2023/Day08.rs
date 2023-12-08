use std::{fs, path::Path, collections::HashMap};

#[derive(Debug)]
struct Node {
    l: String,
    r: String,
}

fn main() {
    // Read file content
    let file_path = Path::new("/tmp/input8.txt");
    let file_content = fs::read_to_string(file_path)
        .expect("Failed to read file");
    let content = file_content.lines().collect::<Vec<_>>();

    // Parse directions and skip empty line
    let directions: Vec<char> = content[0].chars().collect();
    let content = &content[2..];

    let mut nodes = HashMap::new();
    let mut start_nodes = Vec::new();

    for line in content {
        let parts: Vec<_> = line.split('=').collect();
        let nodename = parts[0].trim();
        let lr_part = parts[1].trim().trim_matches(|p| p == '(' || p == ')');
        let lr: Vec<_> = lr_part.split(',').map(|s| s.trim()).collect();
        let l = lr[0].to_string();
        let r = lr[1].to_string();
        let node = Node { l, r };
        nodes.insert(nodename.to_string(), node);
    
        if nodename.ends_with("A") {
            start_nodes.push(nodename.to_string());
        }
    }
    
    // Handle the folding for lcm calculation
    let part2 = start_nodes.iter()
        .map(|start_node| find_num_steps(start_node, &directions, &nodes))
        .reduce(lcm)
        .unwrap();

    println!("Part 2: {}", part2);
}

fn find_num_steps(start_loc: &str, directions: &[char], nodes: &HashMap<String, Node>) -> usize {
    let mut steps = 0;
    let mut loc = start_loc;
    let mut max_iter = 1000;

    while max_iter > 0 {
        for &direction in directions {

            let node = nodes.get(loc).unwrap();

            loc = match direction {
                'L' => &node.l,
                'R' => &node.r,
                _ => panic!("Invalid direction"),
            };

            steps += 1;
            if loc.ends_with("Z") {
                println!("steps: {}", steps);
                return steps;
            }
        }
        max_iter -= 1;
    }
    panic!("Could not figure it out for {}", start_loc);
}

fn gcd(a: usize, b: usize) -> usize {
    if a == 0 { b } else { gcd(b % a, a) }
}

fn lcm(a: usize, b: usize) -> usize {
    a * b / gcd(a, b)
}
