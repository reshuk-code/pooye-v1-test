// Rust implementation of Sieve of Eratosthenes - an efficient algorithm for finding all prime numbers up to a given limit
// Time Complexity: O(n log log n)
// Space Complexity: O(n)

pub struct SieveOfEratosthenes {
    limit: usize,
    primes: Vec<bool>,
}

impl SieveOfEratosthenes {
    /// Creates a new sieve and initializes it with the given limit
    pub fn new(limit: usize) -> Self {
        let mut sieve = SieveOfEratosthenes {
            limit,
            primes: vec![true; limit + 1],
        };
        sieve.compute();
        sieve
    }

    /// Computes all prime numbers up to the limit using the sieve algorithm
    /// The algorithm works by iteratively marking multiples of each prime as composite
    fn compute(&mut self) {
        // 0 and 1 are not prime
        if self.limit > 0 {
            self.primes[0] = false;
        }
        if self.limit > 1 {
            self.primes[1] = false;
        }

        // Start from 2, the smallest prime number
        let mut p = 2;
        while p * p <= self.limit {
            // If p is still marked as prime, mark all its multiples as composite
            if self.primes[p] {
                // Start from p*p because all smaller multiples have been marked already
                let mut multiple = p * p;
                while multiple <= self.limit {
                    self.primes[multiple] = false;
                    multiple += p;
                }
            }
            p += 1;
        }
    }

    /// Returns a vector of all prime numbers up to the limit
    pub fn get_primes(&self) -> Vec<usize> {
        self.primes
            .iter()
            .enumerate()
            .filter_map(|(index, &is_prime)| {
                if is_prime {
                    Some(index)
                } else {
                    None
                }
            })
            .collect()
    }

    /// Checks if a given number is prime
    pub fn is_prime(&self, n: usize) -> bool {
        if n > self.limit {
            return false;
        }
        self.primes[n]
    }

    /// Returns the count of prime numbers up to the limit
    pub fn count_primes(&self) -> usize {
        self.primes.iter().filter(|&&p| p).count()
    }

    /// Returns the nth prime number (1-indexed), or None if it doesn't exist
    pub fn nth_prime(&self, n: usize) -> Option<usize> {
        let primes = self.get_primes();
        if n > 0 && n <= primes.len() {
            Some(primes[n - 1])
        } else {
            None
        }
    }
}

fn main() {
    // Create a sieve for finding all primes up to 100
    let sieve = SieveOfEratosthenes::new(100);

    // Get all prime numbers
    let primes = sieve.get_primes();
    println!("